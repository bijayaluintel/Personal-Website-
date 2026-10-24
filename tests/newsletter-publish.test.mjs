import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import crypto from 'node:crypto'

const event = { _id: 'writing-1', _type: 'writing', operation: 'create' }
const writing = {
  title: 'कविता & <Title>',
  excerpt: 'First line\n<script>bad()</script>',
  category: 'poems',
  slug: 'मेरो-कविता',
  publishedAt: '2026-01-01T00:00:00Z',
}
const env = {
  KIT_API_KEY: 'test',
  KIT_NEWSLETTER_SEGMENT_ID: '17',
  SANITY_NEWSLETTER_WRITE_TOKEN: 'test',
  SITE_URL: 'https://example.com',
  NEXT_PUBLIC_SANITY_PROJECT_ID: 'test',
  NEXT_PUBLIC_SANITY_DATASET: 'production',
  NEWSLETTER_AUTO_SEND: 'true',
}
function load(file, requireMock, globals = {}) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText
  const context = {
    exports: {},
    require: requireMock,
    URL,
    Response,
    Date,
    AbortSignal,
    console,
    ...globals,
  }
  vm.runInNewContext(code, context)
  return context.exports
}
function setup(overrides = {}) {
  const records = new Map()
  const calls = []
  const client = {
    fetch: async () =>
      overrides.writing === undefined ? writing : overrides.writing,
    create: async (doc) => {
      if (records.has(doc._id))
        throw Object.assign(new Error('Conflict'), { statusCode: 409 })
      records.set(doc._id, { ...doc })
    },
    getDocument: async (id) => records.get(id),
    patch: (id) => ({
      set: (values) => ({
        commit: async () => {
          if (overrides.failFinalWrite && values.broadcastId)
            throw new Error('Storage unavailable')
          Object.assign(records.get(id), values)
        },
      }),
    }),
  }
  const publish = load(
    'lib/newsletter/publish.ts',
    (name) =>
      name === 'node:crypto'
        ? crypto
        : { createClient: () => client, defineQuery: (x) => x },
    {
      process: { env: { ...env, ...overrides.env } },
      fetch: async (url, options) => {
        calls.push({ url, options })
        if (overrides.error) throw overrides.error
        return Response.json(
          { broadcast: { id: 42 } },
          { status: overrides.status || 201 },
        )
      },
    },
  )
  return { ...publish, records, calls }
}
test('published-create events only; drafts, versions and updates are ignored', () => {
  const p = setup()
  assert.equal(p.isPublicationEvent(event), true)
  for (const value of [
    null,
    {},
    { ...event, operation: 'update' },
    { ...event, _id: 'drafts.writing-1' },
    { ...event, _id: 'versions.release.writing-1' },
    { ...event, _type: 'newsletterDelivery' },
  ])
    assert.equal(p.isPublicationEvent(value), false)
})
test('safe HTML and encoded Nepali URL', () => {
  const p = setup()
  const email = p.buildWritingEmail(writing, env.SITE_URL)
  assert.ok(email.content.includes('&lt;script&gt;'))
  assert.ok(!email.content.includes('<script>'))
  assert.ok(email.content.includes(encodeURIComponent(writing.slug)))
  assert.ok(email.content.includes('<br />'))
  assert.throws(() => p.buildWritingEmail(writing, 'javascript:bad'))
})
test('concurrent and repeated deliveries produce one scheduled broadcast', async () => {
  const p = setup()
  await Promise.allSettled([
    p.publishWritingEmail(event),
    p.publishWritingEmail(event),
  ])
  assert.equal(p.calls.length, 1)
  assert.equal((await p.publishWritingEmail(event)).status, 'duplicate')
  assert.equal(p.calls.length, 1)
  const body = JSON.parse(p.calls[0].options.body)
  assert.deepEqual(body.subscriber_filter, [
    { all: [{ type: 'segment', ids: [17] }] },
  ])
  assert.ok(Date.parse(body.send_at) > Date.now())
  assert.equal(body.public, false)
  assert.equal([...p.records.values()][0].status, 'scheduled')
})
test('draft mode never schedules a send', async () => {
  const p = setup({ env: { NEWSLETTER_AUTO_SEND: 'false' } })
  assert.equal((await p.publishWritingEmail(event)).status, 'draft')
  assert.equal(JSON.parse(p.calls[0].options.body).send_at, null)
})
test('missing configuration and invalid content do not reserve or send', async () => {
  for (const options of [
    { env: { KIT_NEWSLETTER_SEGMENT_ID: '' } },
    { writing: { ...writing, slug: '' } },
    { env: { SITE_URL: 'http://example.com' } },
  ]) {
    const p = setup(options)
    await assert.rejects(p.publishWritingEmail(event))
    assert.equal(p.records.size, 0)
    assert.equal(p.calls.length, 0)
  }
  const p = setup({ writing: null })
  assert.equal((await p.publishWritingEmail(event)).status, 'skipped')
  assert.equal(p.calls.length, 0)
})
test('timeout, provider rejection and failed persistence never trigger another broadcast', async () => {
  for (const options of [
    { error: new Error('Timeout') },
    { status: 429 },
    { failFinalWrite: true },
  ]) {
    const p = setup(options)
    await assert.rejects(p.publishWritingEmail(event))
    await assert.rejects(p.publishWritingEmail(event))
    assert.equal(p.calls.length, 1)
    assert.ok(
      ['failed', 'needsReview'].includes([...p.records.values()][0].status),
    )
  }
})
test('future publication dates delay sending', async () => {
  const future = new Date(Date.now() + 86400000).toISOString()
  const p = setup({ writing: { ...writing, publishedAt: future } })
  await p.publishWritingEmail(event)
  assert.equal(
    Date.parse(JSON.parse(p.calls[0].options.body).send_at),
    Date.parse(future) + 300000,
  )
})
test('route rejects an invalid signature before publishing', async () => {
  let called = false
  const route = load(
    'app/api/newsletter/publish/route.ts',
    (name) =>
      name === 'next-sanity/webhook'
        ? { parseBody: async () => ({ body: event, isValidSignature: false }) }
        : {
            isPublicationEvent: () => true,
            publishWritingEmail: async () => {
              called = true
            },
          },
    { process: { env: { SANITY_NEWSLETTER_WEBHOOK_SECRET: 'test' } } },
  )
  assert.equal((await route.POST({})).status, 401)
  assert.equal(called, false)
})
test('route requires a secret and ignores update events', async () => {
  const p = setup()
  let called = false
  const mock = (name) =>
    name === 'next-sanity/webhook'
      ? {
          parseBody: async () => ({
            body: { ...event, operation: 'update' },
            isValidSignature: true,
          }),
        }
      : {
          isPublicationEvent: p.isPublicationEvent,
          publishWritingEmail: async () => {
            called = true
          },
        }
  const unconfigured = load('app/api/newsletter/publish/route.ts', mock, {
    process: { env: {} },
  })
  assert.equal((await unconfigured.POST({})).status, 503)
  const route = load('app/api/newsletter/publish/route.ts', mock, {
    process: { env: { SANITY_NEWSLETTER_WEBHOOK_SECRET: 'test' } },
  })
  assert.equal((await route.POST({})).status, 200)
  assert.equal(called, false)
})
