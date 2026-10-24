import { createHash } from 'node:crypto'
import { createClient, defineQuery } from 'next-sanity'

export type PublicationEvent = { _id: string; _type: string; operation: string }
type Writing = {
  title: string
  excerpt: string
  category: string
  slug: string
  publishedAt: string
}

const WRITING_QUERY = defineQuery(/* groq */ `
  *[_id == $id && _type == "writing"][0]{
    title, excerpt, category, "slug": slug.current, publishedAt
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

export function buildWritingEmail(writing: Writing, siteUrl: string) {
  const origin = new URL(siteUrl)
  if (origin.protocol !== 'https:' || origin.username || origin.password) {
    throw new Error('SITE_URL must be a public HTTPS website URL')
  }
  const link = new URL(
    `/writings/${encodeURIComponent(writing.category)}/${encodeURIComponent(writing.slug)}`,
    origin.origin,
  ).href
  return {
    subject: writing.title.replace(/[\r\n]+/g, ' ').trim(),
    preview_text: writing.excerpt.slice(0, 150),
    content:
      `<h1>${escapeHtml(writing.title)}</h1>` +
      `<p>${escapeHtml(writing.excerpt).replace(/\r?\n/g, '<br />')}</p>` +
      `<p><a href="${escapeHtml(link)}">पूरा रचना पढ्नुहोस् / Read the full piece</a></p>`,
  }
}

export function isPublicationEvent(value: unknown): value is PublicationEvent {
  if (!value || typeof value !== 'object') return false
  const event = value as Partial<PublicationEvent>
  return (
    typeof event._id === 'string' &&
    /^[a-zA-Z0-9_.-]+$/.test(event._id) &&
    !event._id.startsWith('drafts.') &&
    !event._id.startsWith('versions.') &&
    event._type === 'writing' &&
    event.operation === 'create'
  )
}

export async function publishWritingEmail(event: PublicationEvent) {
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
  const writing = await client.fetch<Writing | null>(
    WRITING_QUERY,
    { id: event._id },
    { cache: 'no-store' },
  )
  if (!writing)
    return { status: 'skipped', reason: 'Writing is no longer published' }
  if (
    !writing.title?.trim() ||
    !writing.slug?.trim() ||
    !writing.excerpt?.trim() ||
    !['poems', 'stories', 'memoirs', 'others'].includes(writing.category) ||
    !Number.isFinite(Date.parse(writing.publishedAt))
  ) {
    throw new Error('Published writing is missing required email content')
  }
  const email = buildWritingEmail(writing, SITE_URL)
  const autoSend = process.env.NEWSLETTER_AUTO_SEND === 'true'
  // Five minutes allows the public page cache to refresh and gives the editor time to cancel in Kit.
  const sendAt = autoSend
    ? new Date(
        Math.max(Date.now(), Date.parse(writing.publishedAt)) + 5 * 60 * 1000,
      ).toISOString()
    : null
  // This deterministic ID is an integration lock, not an ordinary content document ID.
  // It survives unpublishing and republishing the source writing.
  const deliveryId = `newsletterDelivery.${createHash('sha256').update(event._id).digest('hex')}`
  try {
    await client.create({
      _id: deliveryId,
      _type: 'newsletterDelivery',
      writing: { _type: 'reference', _ref: event._id, _weak: true },
      title: writing.title,
      status: 'processing',
      sendAt,
    })
  } catch (error) {
    if ((error as { statusCode?: number }).statusCode !== 409) throw error
    const previous = await client.getDocument<{ _id: string; status: string }>(
      deliveryId,
    )
    if (previous?.status === 'scheduled' || previous?.status === 'draft') {
      return { status: 'duplicate' }
    }
    // Never repeat a send after a timeout: Kit may already have accepted it.
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
        published_at: writing.publishedAt,
        send_at: sendAt,
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
        status: autoSend ? 'scheduled' : 'draft',
        broadcastId: result.broadcast.id,
      })
      .commit()
    return { status: autoSend ? 'scheduled' : 'draft' }
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
