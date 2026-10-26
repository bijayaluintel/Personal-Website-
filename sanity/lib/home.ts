import type {SanityImageSource} from '@sanity/image-url'
import {defineQuery} from 'next-sanity'
import {client} from './client'
import {urlFor} from './image'
import {getYouTubeThumbnail} from './youtube'
import {DEFAULT_SPOTIFY_URL, getSpotifyTrackId} from './spotify'

type ImageValue = SanityImageSource & {alt?: string}
type LinkValue = {label?: string; url?: string}
type QuoteValue = {_key: string; quote: string; source: string; language: 'ne' | 'en'}
type FeaturedValue = {
  _key: string
  contentType: 'writing' | 'video'
  typeLabel: string
  writing?: {title: string; excerpt: string; category: string; slug: string; mainImage?: ImageValue}
  videoTitle?: string
  videoExcerpt?: string
  videoUrl?: string
  videoThumbnail?: ImageValue
}
type TextAlignment = 'left' | 'center' | 'right' | 'justify'

type HomeDocument = {
  heroTitle?: string; heroRoles?: string; heroTagline?: string; heroTaglineAlignment?: TextAlignment; heroImage?: ImageValue; heroCutoutImage?: ImageValue; heroPrimaryLink?: LinkValue; heroSecondaryLink?: LinkValue
  bookTitle?: string; bookDescription?: string; bookDescriptionAlignment?: TextAlignment; bookCover?: ImageValue; bookVideoLabel?: string; bookVideoPrompt?: string; bookVideoUrl?: string; bookVideoThumbnail?: ImageValue; bookPrimaryLink?: LinkValue; bookSecondaryLink?: LinkValue
  quotesEyebrow?: string; quotesTitle?: string; quotesEmphasis?: string; quotesDescription?: string; quotesLabel?: string; quotes?: QuoteValue[]
  audiobookLabel?: string; audiobookDescription?: string; audiobookSpotifyUrl?: string
  newsletterEyebrow?: string; newsletterTitle?: string; newsletterDescription?: string; newsletterPrivacy?: string
  featuredEyebrow?: string; featuredTitle?: string; featuredPosts?: FeaturedValue[]
}

type LinkItem = {label: string; href: string}
export type FeaturedWriting = {contentType: 'writing' | 'video'; number: string; type: string; title: string; excerpt: string; href: string; image: string; imageAlt: string}
export type HomeContent = {
  hero: {title: string; roles: string; tagline: string; taglineAlignment: TextAlignment; primaryCta: LinkItem; secondaryCta: LinkItem; image: string; imageAlt: string}
  book: {title: string; description: string; descriptionAlignment: TextAlignment; video: {label: string; prompt: string; href: string; thumbnail: string; thumbnailAlt: string}; cover: string; coverAlt: string; links: [LinkItem, LinkItem]}
  quotesHeading: {eyebrow: string; title: string; emphasis: string; description: string}
  quotes: Array<{type: string; items: Array<{quote: string; source: string; lang: 'ne' | 'en'}>}>
  audiobook: {label: string; description: string; href: string; embedUrl: string}
  newsletter: {eyebrow: string; title: string; description: string; privacy: string; success: string; error: string}
  featuredHeading: {eyebrow: string; title: string}
  writings: FeaturedWriting[]
}

const HOME_QUERY = defineQuery(/* groq */ `
  *[_type == "homePage" && _id == "homePage"][0]{
    heroTitle, heroRoles, heroTagline, heroTaglineAlignment, heroImage, heroCutoutImage, heroPrimaryLink, heroSecondaryLink,
    bookTitle, bookDescription, bookDescriptionAlignment, bookCover, bookVideoLabel, bookVideoPrompt, bookVideoUrl, bookVideoThumbnail, bookPrimaryLink, bookSecondaryLink,
    quotesEyebrow, quotesTitle, quotesEmphasis, quotesDescription, quotesLabel,
    quotes[]{_key, quote, source, language}, audiobookLabel, audiobookDescription, audiobookSpotifyUrl,
    newsletterEyebrow, newsletterTitle, newsletterDescription, newsletterPrivacy,
    featuredEyebrow, featuredTitle,
    featuredPosts[]{_key, contentType, typeLabel, videoTitle, videoExcerpt, videoUrl, videoThumbnail, writing->{title, excerpt, category, "slug": slug.current, mainImage}}
  }
`)

const MASTHEAD_QUERY = defineQuery(/* groq */ `*[_type == "homePage" && _id == "homePage"][0]{heroTitle, heroRoles}`)

export async function getMastheadContent() {
  const data = await client.fetch<Pick<HomeDocument, 'heroTitle' | 'heroRoles'> | null>(MASTHEAD_QUERY, {}, {next: {revalidate: 60, tags: ['home']}})
  return {title: data?.heroTitle || 'Bijaya Luintel', roles: data?.heroRoles || ''}
}

function imageUrl(image: ImageValue | undefined, width: number) {
  return image ? urlFor(image).width(width).quality(85).auto('format').url() : ''
}

function link(value?: LinkValue): LinkItem {
  return {label: value?.label || '', href: value?.url || '#'}
}

function mapFeatured(posts: FeaturedValue[] | undefined): FeaturedWriting[] {
  const featured: FeaturedWriting[] = []
  ;(posts || []).forEach((post, index) => {
    const number = String(index + 1).padStart(2, '0')
    if (post.contentType === 'writing' && post.writing?.slug) {
      featured.push({contentType: 'writing', number, type: post.typeLabel, title: post.writing.title, excerpt: post.writing.excerpt, href: `/writings/${post.writing.category}/${post.writing.slug}`, image: imageUrl(post.writing.mainImage, 1200), imageAlt: post.writing.mainImage?.alt || post.writing.title})
    }
    if (post.contentType === 'video' && post.videoTitle && post.videoUrl) {
      featured.push({contentType: 'video', number, type: post.typeLabel, title: post.videoTitle, excerpt: post.videoExcerpt || '', href: post.videoUrl, image: imageUrl(post.videoThumbnail, 1200) || getYouTubeThumbnail(post.videoUrl) || '', imageAlt: post.videoThumbnail?.alt || `${post.videoTitle} video thumbnail`})
    }
  })
  return featured
}

export async function getHomeContent(): Promise<HomeContent> {
  const data = await client.fetch<HomeDocument | null>(HOME_QUERY, {}, {next: {revalidate: 60, tags: ['home']}})
  if (!data) throw new Error('The Sanity homePage singleton is missing.')

  const bookVideoUrl = data.bookVideoUrl || ''
  const spotifyTrackId = getSpotifyTrackId(data.audiobookSpotifyUrl || '') || getSpotifyTrackId(DEFAULT_SPOTIFY_URL)!
  return {
    hero: {title: data.heroTitle || '', roles: data.heroRoles || '', tagline: data.heroTagline || '', taglineAlignment: data.heroTaglineAlignment || 'left', primaryCta: link(data.heroPrimaryLink), secondaryCta: link(data.heroSecondaryLink), image: imageUrl(data.heroCutoutImage, 1100) || '/bijaya-hero-cutout-v3.png', imageAlt: data.heroCutoutImage?.alt || 'Bijaya Luintel'},
    book: {title: data.bookTitle || '', description: data.bookDescription || '', descriptionAlignment: data.bookDescriptionAlignment || 'left', video: {label: data.bookVideoLabel || '', prompt: data.bookVideoPrompt || '', href: bookVideoUrl, thumbnail: imageUrl(data.bookVideoThumbnail, 1200) || getYouTubeThumbnail(bookVideoUrl) || '', thumbnailAlt: data.bookVideoThumbnail?.alt || data.bookVideoLabel || ''}, cover: imageUrl(data.bookCover, 900), coverAlt: data.bookCover?.alt || '', links: [link(data.bookPrimaryLink), link(data.bookSecondaryLink)]},
    quotesHeading: {eyebrow: data.quotesEyebrow || '', title: data.quotesTitle || '', emphasis: data.quotesEmphasis || '', description: data.quotesDescription || ''},
    quotes: [{type: data.quotesLabel || '', items: (data.quotes || []).map((item) => ({quote: item.quote, source: item.source, lang: item.language}))}],
    audiobook: {label: data.audiobookLabel || 'Audiobook', description: data.audiobookDescription || 'Listen to the audiobook on Spotify.', href: `https://open.spotify.com/track/${spotifyTrackId}`, embedUrl: `https://open.spotify.com/embed/track/${spotifyTrackId}`},
    newsletter: {eyebrow: data.newsletterEyebrow || '', title: data.newsletterTitle || '', description: data.newsletterDescription || '', privacy: data.newsletterPrivacy || '', success: 'Please check your inbox to confirm your subscription.', error: 'We couldn’t complete your subscription. Please try again later.'},
    featuredHeading: {eyebrow: data.featuredEyebrow || '', title: data.featuredTitle || ''},
    writings: mapFeatured(data.featuredPosts),
  }
}
