import {getYouTubeThumbnail} from './youtube'

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

  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    const attributes = readAttributes(tag)
    const rel = attributes.get('rel')?.toLowerCase().split(/\s+/) || []
    if (!rel.includes('image_src')) continue
    const linkImage = absoluteUrl(attributes.get('href'), pageUrl)
    if (linkImage) return {url: linkImage, type: 'image'}
  }

  for (const script of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const json = JSON.parse(decodeHtmlEntities(script[1]))
      const pending: unknown[] = [json]
      while (pending.length > 0) {
        const value = pending.shift()
        if (!value || typeof value !== 'object') continue
        if (Array.isArray(value)) {
          pending.push(...value)
          continue
        }

        const record = value as Record<string, unknown>
        for (const key of ['thumbnailUrl', 'image']) {
          const candidate = record[key]
          const rawUrl =
            typeof candidate === 'string'
              ? candidate
              : candidate && typeof candidate === 'object' && !Array.isArray(candidate)
                ? (candidate as Record<string, unknown>).url
                : Array.isArray(candidate)
                  ? candidate[0]
                  : undefined
          const jsonImage = absoluteUrl(typeof rawUrl === 'string' ? rawUrl : undefined, pageUrl)
          if (jsonImage) return {url: jsonImage, type: 'image'}
        }
        pending.push(...Object.values(record))
      }
    } catch {
      // Ignore invalid JSON-LD and continue to HTML media fallbacks.
    }
  }

  for (const tag of html.match(/<video\b[^>]*>/gi) ?? []) {
    const poster = absoluteUrl(readAttributes(tag).get('poster'), pageUrl)
    if (poster) return {url: poster, type: 'image'}
  }

  const articleMarkup = html.match(/<(?:article|main)\b[^>]*>[\s\S]*?<\/(?:article|main)>/i)?.[0] || html
  for (const tag of articleMarkup.match(/<img\b[^>]*>/gi) ?? []) {
    const attributes = readAttributes(tag)
    const descriptor = `${attributes.get('class') || ''} ${attributes.get('id') || ''} ${attributes.get('alt') || ''}`.toLowerCase()
    if (/\b(?:avatar|emoji|icon|logo|spinner|tracking|pixel)\b/.test(descriptor)) continue

    const candidates = [
      attributes.get('data-src') ||
      attributes.get('data-lazy-src'),
      attributes.get('src'),
      attributes.get('srcset')?.split(',').at(-1)?.trim().split(/\s+/)[0],
    ]
    for (const candidate of candidates) {
      const pageImage = absoluteUrl(candidate, pageUrl)
      if (pageImage) return {url: pageImage, type: 'image'}
    }
  }

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

function previewFromMarkdown(markdown: string): LinkPreview | undefined {
  for (const match of markdown.matchAll(/!\[[^\]]*\]\((https?:\/\/[^)\s]+)[^)]*\)/gi)) {
    const imageUrl = decodeHtmlEntities(match[1])
    if (/\b(?:logo|avatar|icon|emoji|advert|ads?|banner|fonepay|payment|qr)[-_./]/i.test(imageUrl)) continue
    return {url: imageUrl, type: 'image'}
  }
  return undefined
}

const browserHeaders = {
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
}

async function extractedPagePreview(url: string): Promise<LinkPreview | undefined> {
  try {
    const response = await fetch(`https://r.jina.ai/${url}`, {
      headers: {Accept: 'text/plain', 'User-Agent': 'Mozilla/5.0'},
      next: {revalidate: 86_400},
      signal: AbortSignal.timeout(15_000),
    })
    return response.ok
      ? previewFromMarkdown((await response.text()).slice(0, 2_000_000))
      : undefined
  } catch {
    return undefined
  }
}

export async function getLinkPreview(url: string): Promise<LinkPreview | undefined> {
  if (!isPublicHttpUrl(url)) return undefined

  const youtubeThumbnail = getYouTubeThumbnail(url)
  if (youtubeThumbnail) return {url: youtubeThumbnail, type: 'image'}

  try {
    const response = await fetch(url, {
      headers: browserHeaders,
      next: {revalidate: 86_400},
      signal: AbortSignal.timeout(8_000),
    })
    if (!response.ok) {
      return extractedPagePreview(url)
    }

    const contentType = response.headers.get('content-type')?.toLowerCase() || ''
    if (contentType.startsWith('image/')) return {url: response.url, type: 'image'}
    if (contentType.startsWith('video/')) return {url: response.url, type: 'video'}
    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
      return extractedPagePreview(url)
    }

    return previewFromHtml((await response.text()).slice(0, 2_000_000), response.url) || extractedPagePreview(url)
  } catch {
    return extractedPagePreview(url)
  }
}
