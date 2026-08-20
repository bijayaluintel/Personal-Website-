import type {SanityImageSource} from '@sanity/image-url'
import {defineQuery} from 'next-sanity'
import {client} from './client'
import {urlFor} from './image'
import {getYouTubeThumbnail} from './youtube'

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
  quotesEyebrow?: string; quotesTitle?: string; quotesEmphasis?: string; quotesDescription?: string; quotesLabel?: string; quotes?: QuoteValue[]; readerNotesLabel?: string; readerNotes?: QuoteValue[]
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
  newsletter: {eyebrow: string; title: string; description: string; privacy: string; success: string; error: string}
  featuredHeading: {eyebrow: string; title: string}
  writings: FeaturedWriting[]
}

const HOME_QUERY = defineQuery(/* groq */ `
  *[_type == "homePage" && _id == "homePage"][0]{
    heroTitle, heroRoles, heroTagline, heroTaglineAlignment, heroImage, heroCutoutImage, heroPrimaryLink, heroSecondaryLink,
    bookTitle, bookDescription, bookDescriptionAlignment, bookCover, bookVideoLabel, bookVideoPrompt, bookVideoUrl, bookVideoThumbnail, bookPrimaryLink, bookSecondaryLink,
    quotesEyebrow, quotesTitle, quotesEmphasis, quotesDescription, quotesLabel,
    quotes[]{_key, quote, source, language}, readerNotesLabel, readerNotes[]{_key, quote, source, language},
    newsletterEyebrow, newsletterTitle, newsletterDescription, newsletterPrivacy,
    featuredEyebrow, featuredTitle,
    featuredPosts[]{_key, contentType, typeLabel, videoTitle, videoExcerpt, videoUrl, videoThumbnail, writing->{title, excerpt, category, "slug": slug.current, mainImage}}
  }
`)

function imageUrl(image: ImageValue | undefined, width: number) {
  return image ? urlFor(image).width(width).quality(85).auto('format').url() : ''
}

function framedHeroImageUrl(image: ImageValue | undefined) {
  return image
    ? urlFor(image).width(1100).height(1375).fit('crop').quality(88).auto('format').url()
    : ''
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
  return {
    hero: {title: data.heroTitle || '', roles: data.heroRoles || '', tagline: data.heroTagline || '', taglineAlignment: data.heroTaglineAlignment || 'left', primaryCta: link(data.heroPrimaryLink), secondaryCta: link(data.heroSecondaryLink), image: framedHeroImageUrl(data.heroImage) || '/bijaya-hero-cutout-v3.png', imageAlt: data.heroImage?.alt || 'Bijaya Luintel'},
    book: {title: data.bookTitle || '', description: data.bookDescription || '', descriptionAlignment: data.bookDescriptionAlignment || 'left', video: {label: data.bookVideoLabel || '', prompt: data.bookVideoPrompt || '', href: bookVideoUrl, thumbnail: imageUrl(data.bookVideoThumbnail, 1200) || getYouTubeThumbnail(bookVideoUrl) || '', thumbnailAlt: data.bookVideoThumbnail?.alt || data.bookVideoLabel || ''}, cover: imageUrl(data.bookCover, 900), coverAlt: data.bookCover?.alt || '', links: [link(data.bookPrimaryLink), link(data.bookSecondaryLink)]},
    quotesHeading: {eyebrow: data.quotesEyebrow || '', title: data.quotesTitle || '', emphasis: data.quotesEmphasis || '', description: data.quotesDescription || ''},
    quotes: [{type: data.quotesLabel || '', items: (data.quotes || []).map((item) => ({quote: item.quote, source: item.source, lang: item.language}))}, {type: data.readerNotesLabel || '', items: (data.readerNotes || []).map((item) => ({quote: item.quote, source: item.source, lang: item.language}))}],
    newsletter: {eyebrow: data.newsletterEyebrow || '', title: data.newsletterTitle || '', description: data.newsletterDescription || '', privacy: data.newsletterPrivacy || '', success: 'Please check your inbox to confirm your subscription.', error: 'We couldn’t complete your subscription. Please try again later.'},
    featuredHeading: {eyebrow: data.featuredEyebrow || '', title: data.featuredTitle || ''},
    writings: mapFeatured(data.featuredPosts),
  }
}
