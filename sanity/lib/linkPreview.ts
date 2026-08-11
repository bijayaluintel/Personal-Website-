const HTML_ENTITY_PATTERN = /&(?:amp|quot|apos|lt|gt|#\d+|#x[\da-f]+);/gi

export type LinkPreview = {
  url: string
  type: 'image' | 'video'
}

function decodeHtmlEntities(value: string) {
  return value.replace(HTML_ENTITY_PATTERN, (entity) => {
    const named: Record<string, string> = {
      '&amp;': '&',
      '&quot;': '"',
      '&apos;': "'",
      '&lt;': '<',
      '&gt;': '>',
    }
    const normalized = entity.toLowerCase()
    if (named[normalized]) return named[normalized]

    const isHex = normalized.startsWith('&#x')
    const codePoint = Number.parseInt(
      normalized.slice(isHex ? 3 : 2, -1),
      isHex ? 16 : 10,
    )
    return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : entity
  })
}

function readAttributes(tag: string) {
  const attributes = new Map<string, string>()
  const pattern = /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g
  for (const match of tag.matchAll(pattern)) {
    attributes.set(match[1].toLowerCase(), decodeHtmlEntities(match[2] ?? match[3] ?? match[4] ?? ''))
  }
  return attributes
}

function absoluteUrl(value: string | undefined, pageUrl: string) {
  if (!value) return undefined
  try {
    const url = new URL(value, pageUrl)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : undefined
  } catch {
    return undefined
  }
}

function previewFromHtml(html: string, pageUrl: string): LinkPreview | undefined {
  const metadata = new Map<string, string>()

  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const attributes = readAttributes(tag)
    const key = (attributes.get('property') || attributes.get('name'))?.toLowerCase()
    const content = attributes.get('content')
    if (key && content && !metadata.has(key)) metadata.set(key, content)
  }

  const image =
    metadata.get('og:image:secure_url') ||
    metadata.get('og:image') ||
    metadata.get('twitter:image') ||
    metadata.get('twitter:image:src')
  const imageUrl = absoluteUrl(image, pageUrl)
  if (imageUrl) return {url: imageUrl, type: 'image'}

  const video =
    metadata.get('og:video:secure_url') ||
    metadata.get('og:video') ||
    metadata.get('twitter:player:stream')
  const videoUrl = absoluteUrl(video, pageUrl)
  return videoUrl ? {url: videoUrl, type: 'video'} : undefined
}

function isPublicHttpUrl(value: string) {
  try {
    const url = new URL(value)
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return false

    const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, '')
    return !(
      hostname === 'localhost' ||
      hostname.endsWith('.localhost') ||
      hostname === '::1' ||
      hostname.startsWith('127.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('192.168.') ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(hostname) ||
      hostname === '0.0.0.0'
    )
  } catch {
    return false
  }
}

export async function getLinkPreview(url: string): Promise<LinkPreview | undefined> {
  if (!isPublicHttpUrl(url)) return undefined

  const youtubeThumbnail = getYouTubeThumbnail(url)
  if (youtubeThumbnail) return {url: youtubeThumbnail, type: 'image'}

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'text/html,application/xhtml+xml,image/*,video/*;q=0.9',
        'User-Agent': 'Mozilla/5.0 (compatible; BijayaLuintelPreview/1.0)',
      },
      next: {revalidate: 86_400},
      signal: AbortSignal.timeout(5_000),
    })
    if (!response.ok) return undefined

    const contentType = response.headers.get('content-type')?.toLowerCase() || ''
    if (contentType.startsWith('image/')) return {url: response.url, type: 'image'}
    if (contentType.startsWith('video/')) return {url: response.url, type: 'video'}
    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) return undefined

    return previewFromHtml((await response.text()).slice(0, 1_000_000), response.url)
  } catch {
    return undefined
  }
}
import {getYouTubeThumbnail} from './youtube'
