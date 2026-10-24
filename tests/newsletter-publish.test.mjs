import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import crypto from 'node:crypto'
import * as sanityImageUrl from '@sanity/image-url'

const event = { _id: 'issue-1', _type: 'newsletterIssue', operation: 'create' }
const writing = {
  _id: 'article-1',
  title: 'कविता & <Title>',
  excerpt: 'First line\n<script>bad()</script>',
  category: 'poems',
  slug: 'मेरो-कविता',
  publishedAt: '2026-01-01T00:00:00Z',
}
const issue = {
  subject: 'Selected writings',
  introduction: 'A note & <hello>',
  articles: [
    writing,
    { ...writing, _id: 'article-2', title: 'Second article' },
    { ...writing, _id: 'article-3', title: 'Third article' },
  ],
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
      overrides.issue === undefined ? issue : overrides.issue,
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
        : name === '@sanity/image-url' ? sanityImageUrl
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
  assert.equal(p.isNewsletterEvent(event), true)
  for (const value of [
    null,
    {},
    { ...event, operation: 'update' },
    { ...event, _id: 'drafts.writing-1' },
    { ...event, _id: 'versions.release.writing-1' },
    { ...event, _type: 'newsletterDelivery' },
    { ...event, _type: 'writing' },
  ])
    assert.equal(p.isNewsletterEvent(value), false)
})
test('safe HTML and encoded Nepali URL', () => {
  const p = setup()
  const email = p.buildNewsletterEmail(issue, env.SITE_URL)
  assert.ok(email.content.includes('&lt;script&gt;'))
  assert.ok(!email.content.includes('<script>'))
  assert.ok(email.content.includes(encodeURIComponent(writing.slug)))
  assert.ok(email.content.includes('<br />'))
  assert.throws(() => p.buildNewsletterEmail(issue, 'javascript:bad'))
})
test('concurrent and repeated deliveries produce one Kit draft', async () => {
  const p = setup()
  await Promise.allSettled([
    p.createNewsletterDraft(event),
    p.createNewsletterDraft(event),
  ])
  assert.equal(p.calls.length, 1)
  assert.equal((await p.createNewsletterDraft(event)).status, 'duplicate')
  assert.equal(p.calls.length, 1)
  const body = JSON.parse(p.calls[0].options.body)
  assert.deepEqual(body.subscriber_filter, [
    { all: [{ type: 'segment', ids: [17] }] },
  ])
  assert.equal(body.send_at, null)
  assert.equal(body.public, false)
  assert.equal([...p.records.values()][0].status, 'draft')
})
test('old auto-send setting never schedules a send', async () => {
  const p = setup({ env: { NEWSLETTER_AUTO_SEND: 'true' } })
  assert.equal((await p.createNewsletterDraft(event)).status, 'draft')
  assert.equal(JSON.parse(p.calls[0].options.body).send_at, null)
})
test('missing configuration and invalid content do not reserve or send', async () => {
  for (const options of [
    { env: { KIT_NEWSLETTER_SEGMENT_ID: '' } },
    { issue: { ...issue, articles: [null, ...issue.articles.slice(1)] } },
    { env: { SITE_URL: 'http://example.com' } },
  ]) {
    const p = setup(options)
    await assert.rejects(p.createNewsletterDraft(event))
    assert.equal(p.records.size, 0)
    assert.equal(p.calls.length, 0)
  }
  const p = setup({ issue: null })
  await assert.rejects(p.createNewsletterDraft(event))
  assert.equal(p.calls.length, 0)
})
test('timeout, provider rejection and failed persistence never trigger another broadcast', async () => {
  for (const options of [
    { error: new Error('Timeout') },
    { status: 429 },
    { failFinalWrite: true },
  ]) {
    const p = setup(options)
    await assert.rejects(p.createNewsletterDraft(event))
    await assert.rejects(p.createNewsletterDraft(event))
    assert.equal(p.calls.length, 1)
    assert.ok(
      ['failed', 'needsReview'].includes([...p.records.values()][0].status),
    )
  }
})
test('accepts one, two and larger selections and preserves article order', () => {
  const p = setup()
  for (const count of [1, 2, 3, 4, 5, 20]) {
    const articles = Array.from({length: count}, (_, index) => ({
      ...writing, _id: `article-${index}`, title: `Selected article ${index}`,
    }))
    const email = p.buildNewsletterEmail({ ...issue, articles }, env.SITE_URL)
    assert.equal((email.content.match(/<h2>/g) || []).length, count)
    let previous = -1
    for (const article of articles) {
      const position = email.content.indexOf(`<h2>${article.title}</h2>`)
      assert.ok(position > previous)
      previous = position
    }
    assert.ok(email.content.includes('A note &amp; &lt;hello&gt;'))
  }
})
test('rejects duplicate, missing, draft, incomplete and empty selections', () => {
  const p = setup()
  for (const articles of [
    [],
    [...issue.articles, writing, writing],
    [writing, writing, writing],
    [null, ...issue.articles.slice(1)],
    [{ ...writing, _id: 'drafts.article-1' }, ...issue.articles.slice(1)],
    [{ ...writing, slug: '' }, ...issue.articles.slice(1)],
  ]) {
    assert.throws(() =>
      p.buildNewsletterEmail({ ...issue, articles }, env.SITE_URL),
    )
  }
})
test('route rejects an invalid signature before publishing', async () => {
  let called = false
  const route = load(
    'app/api/newsletter/publish/route.ts',
    (name) =>
      name === 'next-sanity/webhook'
        ? { parseBody: async () => ({ body: event, isValidSignature: false }) }
        : {
            isNewsletterEvent: () => true,
            createNewsletterDraft: async () => {
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
          isNewsletterEvent: p.isNewsletterEvent,
          createNewsletterDraft: async () => {
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


test('article photo appears between its title and excerpt with safe alt text', () => {
  const p = setup()
  const photo = {asset: {url: 'https://cdn.sanity.io/images/test/production/abcdef123456-1200x800.jpg'}, alt: 'Photo "title" & scenery'}
  const email = p.buildNewsletterEmail({...issue, articles: [{...writing, mainImage: photo}]}, env.SITE_URL)
  assert.ok(email.content.indexOf('<h2>') < email.content.indexOf('<img '))
  assert.ok(email.content.indexOf('<img ') < email.content.indexOf('First line'))
  assert.ok(email.content.includes('alt="Photo &quot;title&quot; &amp; scenery"'))
  assert.ok(email.content.includes('w=1200'))
  assert.ok(email.content.includes('fm=jpg'))
  assert.ok(email.content.includes('height:auto'))
  const fallback = p.buildNewsletterEmail({...issue, articles: [{...writing, mainImage: {...photo, alt: ''}}]}, env.SITE_URL)
  assert.ok(fallback.content.includes('alt="कविता &amp; &lt;Title&gt;"'))
})
test('articles without a photo have no broken image placeholder', () => {
  const p = setup()
  for (const mainImage of [undefined, null, {asset: null}]) {
    const email = p.buildNewsletterEmail({...issue, articles: [{...writing, mainImage}]}, env.SITE_URL)
    assert.ok(!email.content.includes('<img'))
    assert.ok(email.content.includes('Read the full piece'))
  }
})
