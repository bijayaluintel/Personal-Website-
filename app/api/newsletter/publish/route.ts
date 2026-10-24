import type { NextRequest } from 'next/server'
import { parseBody } from 'next-sanity/webhook'
import {
  isNewsletterEvent,
  createNewsletterDraft,
} from '@/lib/newsletter/publish'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_NEWSLETTER_WEBHOOK_SECRET
  if (!secret)
    return Response.json(
      { message: 'Publishing is not configured' },
      { status: 503 },
    )

  let event: unknown
  try {
    const { body, isValidSignature } = await parseBody<unknown>(request, secret)
    if (!isValidSignature)
      return Response.json({ message: 'Invalid signature' }, { status: 401 })
    event = body
  } catch {
    return Response.json({ message: 'Invalid webhook' }, { status: 400 })
  }
  if (!isNewsletterEvent(event)) {
    return Response.json({ status: 'skipped' })
  }
  try {
    return Response.json(await createNewsletterDraft(event))
  } catch (error) {
    console.error(
      'Newsletter publishing failed:',
      error instanceof Error ? error.message : 'Unknown error',
    )
    return Response.json(
      { message: 'Newsletter delivery needs attention; check server logs' },
      { status: 503 },
    )
  }
}
