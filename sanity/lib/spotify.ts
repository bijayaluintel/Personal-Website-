export const DEFAULT_SPOTIFY_URL = 'https://open.spotify.com/track/4vzWxn5KzHpiJgFsrdmc58'

export function getSpotifyTrackId(value: string): string | null {
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || url.hostname !== 'open.spotify.com') return null
    return url.pathname.match(/^\/track\/([A-Za-z0-9]{22})\/?$/)?.[1] || null
  } catch {
    return null
  }
}
