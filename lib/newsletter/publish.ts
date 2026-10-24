import { createHash } from 'node:crypto'
import { createClient, defineQuery } from 'next-sanity'

export type NewsletterEvent = { _id: string; _type: string; operation: string }
type Writing = {
  _id: string
  title: string
  excerpt: string
  category: string
  slug: string
}
type NewsletterIssue = {
  subject: string
  introduction?: string
  articles: Array<Writing | null>
}

const ISSUE_QUERY = defineQuery(/* groq */ `
  *[_id == $id && _type == "newsletterIssue"][0]{
    subject, introduction,
    "articles": articles[]->{_id, title, excerpt, category, "slug": slug.current}
  }
`)

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[character]!,
  )
}

export function buildNewsletterEmail(issue: NewsletterIssue, siteUrl: string) {
  const origin = new URL(siteUrl)
  if (origin.protocol !== 'https:' || origin.username || origin.password) {
    throw new Error('SITE_URL must be a public HTTPS website URL')
  }
  if (
    !issue.subject?.trim() ||
    !Array.isArray(issue.articles) ||
    issue.articles.length < 1
  ) {
    throw new Error(
      'Select at least one published article and enter a newsletter subject',
    )
  }
  const ids = new Set<string>()
  const articles = issue.articles.map((writing) => {
    if (
      !writing ||
      !writing._id ||
      writing._id.startsWith('drafts.') ||
      writing._id.startsWith('versions.') ||
      ids.has(writing._id) ||
      !writing.title?.trim() ||
      !writing.excerpt?.trim() ||
      !writing.slug?.trim() ||
      !['poems', 'stories', 'memoirs', 'others'].includes(writing.category)
    ) {
      throw new Error(
        'Every selection must be a different published writing with a title, excerpt and URL',
      )
    }
    ids.add(writing._id)
    const link = new URL(
      `/writings/${encodeURIComponent(writing.category)}/${encodeURIComponent(writing.slug)}`,
      origin.origin,
    ).href
    return (
      `<h2>${escapeHtml(writing.title)}</h2>` +
      `<p>${escapeHtml(writing.excerpt).replace(/\r?\n/g, '<br />')}</p>` +
      `<p><a href="${escapeHtml(link)}">पूरा रचना पढ्नुहोस् / Read the full piece</a></p>`
    )
  })
  const introduction = issue.introduction?.trim() || ''
  return {
    subject: issue.subject.replace(/[\r\n]+/g, ' ').trim(),
    preview_text: (introduction || issue.articles[0]!.excerpt).slice(0, 150),
    content:
      `<h1>${escapeHtml(issue.subject)}</h1>` +
      (introduction
        ? `<p>${escapeHtml(introduction).replace(/\r?\n/g, '<br />')}</p>`
        : '') +
      articles.join('<hr />'),
  }
}

export function isNewsletterEvent(value: unknown): value is NewsletterEvent {
  if (!value || typeof value !== 'object') return false
  const event = value as Partial<NewsletterEvent>
  return (
    typeof event._id === 'string' &&
    /^[a-zA-Z0-9_.-]+$/.test(event._id) &&
    !event._id.startsWith('drafts.') &&
    !event._id.startsWith('versions.') &&
    event._type === 'newsletterIssue' &&
    event.operation === 'create'
  )
}

export async function createNewsletterDraft(event: NewsletterEvent) {
  const {
    KIT_API_KEY,
    KIT_NEWSLETTER_SEGMENT_ID,
    SANITY_NEWSLETTER_WRITE_TOKEN,
    SITE_URL,
    NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET,
  } = process.env
  if (
    !KIT_API_KEY ||
    !KIT_NEWSLETTER_SEGMENT_ID ||
    !/^\d+$/.test(KIT_NEWSLETTER_SEGMENT_ID) ||
    !SANITY_NEWSLETTER_WRITE_TOKEN ||
    !SITE_URL ||
    !NEXT_PUBLIC_SANITY_PROJECT_ID ||
    !NEXT_PUBLIC_SANITY_DATASET
  ) {
    throw new Error('Newsletter publishing configuration is incomplete')
  }
  const segmentId = Number(KIT_NEWSLETTER_SEGMENT_ID)
  if (!Number.isSafeInteger(segmentId) || segmentId <= 0)
    throw new Error('Invalid Kit segment ID')

  const client = createClient({
    projectId: NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-07-28',
    token: SANITY_NEWSLETTER_WRITE_TOKEN,
    useCdn: false,
    perspective: 'published',
    timeout: 10000,
    maxRetries: 0,
  })
  // Only the published issue and published versions of its selections can be emailed.
  const issue = await client.fetch<NewsletterIssue | null>(
    ISSUE_QUERY,
    { id: event._id },
    { cache: 'no-store' },
  )
  if (!issue)
    throw new Error('Newsletter issue is not available; retry the webhook')
  const email = buildNewsletterEmail(issue, SITE_URL)
  // This deterministic ID is an integration lock, not an ordinary content document ID.
  // Retrying the issue cannot create another Kit draft.
  const deliveryId = `newsletterDelivery.${createHash('sha256').update(event._id).digest('hex')}`
  try {
    await client.create({
      _id: deliveryId,
      _type: 'newsletterDelivery',
      issue: { _type: 'reference', _ref: event._id, _weak: true },
      title: issue.subject,
      status: 'processing',
    })
  } catch (error) {
    if ((error as { statusCode?: number }).statusCode !== 409) throw error
    const previous = await client.getDocument<{ _id: string; status: string }>(
      deliveryId,
    )
    if (previous?.status === 'scheduled' || previous?.status === 'draft') {
      return { status: 'duplicate' }
    }
    // Kit may already have created the draft even if its response was lost.
    throw new Error(
      `Newsletter delivery ${deliveryId} needs review in Sanity and Kit`,
    )
  }

  let kitAccepted = false
  let rejected = false
  try {
    const response = await fetch('https://api.kit.com/v4/broadcasts', {
      method: 'POST',
      headers: {
        'X-Kit-Api-Key': KIT_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...email,
        description: deliveryId,
        public: false,
        published_at: new Date().toISOString(),
        send_at: null,
        subscriber_filter: [{ all: [{ type: 'segment', ids: [segmentId] }] }],
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
    })
    if (!response.ok) {
      rejected = response.status >= 400 && response.status < 500
      throw new Error(`Kit broadcast request returned HTTP ${response.status}`)
    }
    kitAccepted = true
    const result = (await response.json()) as { broadcast?: { id?: number } }
    if (!result.broadcast?.id)
      throw new Error('Kit did not return a broadcast ID')
    await client
      .patch(deliveryId)
      .set({
        status: 'draft',
        broadcastId: result.broadcast.id,
      })
      .commit()
    return { status: 'draft' }
  } catch (error) {
    await client
      .patch(deliveryId)
      .set({
        status: rejected && !kitAccepted ? 'failed' : 'needsReview',
        error:
          error instanceof Error ? error.message : 'Unknown delivery error',
      })
      .commit()
      .catch(() => {})
    throw error
  }
}
