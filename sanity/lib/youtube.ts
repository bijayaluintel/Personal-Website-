export function getYouTubeThumbnail(href?: string) {
  if (!href) return undefined

  try {
    const url = new URL(href)
    const hostname = url.hostname.replace(/^www\./, '')
    let id = hostname === 'youtu.be'
      ? url.pathname.split('/').filter(Boolean)[0]
      : url.searchParams.get('v') || undefined

    if (!id && hostname.endsWith('youtube.com')) {
      const segments = url.pathname.split('/').filter(Boolean)
      if (['embed', 'shorts', 'live'].includes(segments[0])) id = segments[1]
    }

    return id ? `https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg` : undefined
  } catch {
    return undefined
  }
}
