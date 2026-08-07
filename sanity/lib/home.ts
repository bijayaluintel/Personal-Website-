import type {SanityImageSource} from '@sanity/image-url'
import {defineQuery} from 'next-sanity'
import {siteData, type FeaturedWriting} from '@/constants/home'
import {getYouTubeThumbnail} from '@/constants/videos'
import {client} from './client'
import {urlFor} from './image'

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

type HomeDocument = {
  heroTitle?: string; heroRoles?: string; heroTagline?: string; heroImage?: ImageValue; heroPrimaryLink?: LinkValue; heroSecondaryLink?: LinkValue
  bookTitle?: string; bookDescription?: string; bookCover?: ImageValue; bookVideoLabel?: string; bookVideoPrompt?: string; bookVideoUrl?: string; bookVideoThumbnail?: ImageValue; bookPrimaryLink?: LinkValue; bookSecondaryLink?: LinkValue
  quotesEyebrow?: string; quotesTitle?: string; quotesEmphasis?: string; quotesDescription?: string; quotesLabel?: string; quotes?: QuoteValue[]; readerNotesLabel?: string; readerNotes?: QuoteValue[]
  newsletterEyebrow?: string; newsletterTitle?: string; newsletterDescription?: string; newsletterPrivacy?: string
  featuredEyebrow?: string; featuredTitle?: string; featuredPosts?: FeaturedValue[]
}

export type HomeContent = {
  hero: typeof siteData.hero
  book: typeof siteData.book
  quotesHeading: {eyebrow: string; title: string; emphasis: string; description: string}
  quotes: Array<{type: string; items: Array<{quote: string; source: string; lang: 'ne' | 'en'}>}>
  newsletter: typeof siteData.newsletter
  featuredHeading: {eyebrow: string; title: string}
  writings: FeaturedWriting[]
}

const HOME_QUERY = defineQuery(/* groq */ `
  *[_type == "homePage" && _id == "homePage"][0]{
    heroTitle, heroRoles, heroTagline, heroImage, heroPrimaryLink, heroSecondaryLink,
    bookTitle, bookDescription, bookCover, bookVideoLabel, bookVideoPrompt, bookVideoUrl, bookVideoThumbnail, bookPrimaryLink, bookSecondaryLink,
    quotesEyebrow, quotesTitle, quotesEmphasis, quotesDescription, quotesLabel,
    quotes[]{_key, quote, source, language},
    readerNotesLabel, readerNotes[]{_key, quote, source, language},
    newsletterEyebrow, newsletterTitle, newsletterDescription, newsletterPrivacy,
    featuredEyebrow, featuredTitle,
    featuredPosts[]{
      _key, contentType, typeLabel, videoTitle, videoExcerpt, videoUrl, videoThumbnail,
      writing->{title, excerpt, category, "slug": slug.current, mainImage}
    }
  }
`)

function imageUrl(image: ImageValue | undefined, fallback: string, width: number) {
  return image ? urlFor(image).width(width).quality(85).auto('format').url() : fallback
}

function link(value: LinkValue | undefined, fallback: {label: string; href: string}) {
  return {label: value?.label || fallback.label, href: value?.url || fallback.href}
}

function mapFeatured(posts: FeaturedValue[] | undefined): FeaturedWriting[] {
  if (!posts?.length) return siteData.writings

  const featured: FeaturedWriting[] = []
  posts.forEach((post, index) => {
    const number = String(index + 1).padStart(2, '0')
    if (post.contentType === 'writing' && post.writing?.slug) {
      featured.push({
        contentType: 'writing',
        number,
        type: post.typeLabel,
        title: post.writing.title,
        excerpt: post.writing.excerpt,
        href: `/writings/${post.writing.category}/${post.writing.slug}`,
        image: imageUrl(post.writing.mainImage, siteData.writings[0].image, 1200),
        imageAlt: post.writing.mainImage?.alt || post.writing.title,
      })
      return
    }
    if (post.contentType === 'video' && post.videoTitle && post.videoUrl) {
      featured.push({
        contentType: 'video',
        number,
        type: post.typeLabel,
        title: post.videoTitle,
        excerpt: post.videoExcerpt || '',
        href: post.videoUrl,
        image: post.videoThumbnail
          ? imageUrl(post.videoThumbnail, siteData.writings[2].image, 1200)
          : getYouTubeThumbnail(post.videoUrl) || siteData.writings[2].image,
        imageAlt: post.videoThumbnail?.alt || `${post.videoTitle} video thumbnail`,
      })
    }
  })
  return featured.length ? featured : siteData.writings
}

function fallbackQuoteItems(items: Array<{quote: string; source: string; lang: string}>) {
  return items.map((item) => ({
    ...item,
    lang: item.lang === 'en' ? ('en' as const) : ('ne' as const),
  }))
}

export async function getHomeContent(): Promise<HomeContent> {
  try {
    const data = await client.fetch<HomeDocument | null>(HOME_QUERY, {}, {next: {revalidate: 60, tags: ['home']}})
    if (!data) return fallbackHomeContent()

    const bookVideoUrl = data.bookVideoUrl || siteData.book.video.href
    return {
      hero: {
        title: data.heroTitle || siteData.hero.title,
        roles: data.heroRoles || siteData.hero.roles,
        tagline: data.heroTagline || siteData.hero.tagline,
        primaryCta: link(data.heroPrimaryLink, siteData.hero.primaryCta),
        secondaryCta: link(data.heroSecondaryLink, siteData.hero.secondaryCta),
        image: imageUrl(data.heroImage, siteData.hero.image, 1400),
        imageAlt: data.heroImage?.alt || siteData.hero.imageAlt,
      },
      book: {
        title: data.bookTitle || siteData.book.title,
        description: data.bookDescription || siteData.book.description,
        video: {
          label: data.bookVideoLabel || siteData.book.video.label,
          prompt: data.bookVideoPrompt || siteData.book.video.prompt,
          href: bookVideoUrl,
          thumbnail: data.bookVideoThumbnail ? imageUrl(data.bookVideoThumbnail, siteData.book.video.thumbnail, 1200) : getYouTubeThumbnail(bookVideoUrl) || siteData.book.video.thumbnail,
          thumbnailAlt: data.bookVideoThumbnail?.alt || siteData.book.video.thumbnailAlt,
        },
        cover: imageUrl(data.bookCover, siteData.book.cover, 900),
        coverAlt: data.bookCover?.alt || siteData.book.coverAlt,
        links: [link(data.bookPrimaryLink, siteData.book.links[0]), link(data.bookSecondaryLink, siteData.book.links[1])],
      },
      quotesHeading: {
        eyebrow: data.quotesEyebrow || 'Words that linger',
        title: data.quotesTitle || 'On the page',
        emphasis: data.quotesEmphasis || '& beyond',
        description: data.quotesDescription || 'A glimpse from the collection, followed by the words it left with a reader.',
      },
      quotes: [
        {type: data.quotesLabel || siteData.quotes[0].type, items: data.quotes?.length ? data.quotes.map((item) => ({quote: item.quote, source: item.source, lang: item.language})) : fallbackQuoteItems(siteData.quotes[0].items)},
        {type: data.readerNotesLabel || siteData.quotes[1].type, items: data.readerNotes?.length ? data.readerNotes.map((item) => ({quote: item.quote, source: item.source, lang: item.language})) : fallbackQuoteItems(siteData.quotes[1].items)},
      ],
      newsletter: {
        ...siteData.newsletter,
        eyebrow: data.newsletterEyebrow || siteData.newsletter.eyebrow,
        title: data.newsletterTitle || siteData.newsletter.title,
        description: data.newsletterDescription || siteData.newsletter.description,
        privacy: data.newsletterPrivacy || siteData.newsletter.privacy,
      },
      featuredHeading: {eyebrow: data.featuredEyebrow || 'Featured writing', title: data.featuredTitle || 'Featured posts'},
      writings: mapFeatured(data.featuredPosts),
    }
  } catch (error) {
    console.error('Unable to load the home page from Sanity:', error)
    return fallbackHomeContent()
  }
}

function fallbackHomeContent(): HomeContent {
  return {
    hero: siteData.hero,
    book: siteData.book,
    quotesHeading: {eyebrow: 'Words that linger', title: 'On the page', emphasis: '& beyond', description: 'A glimpse from the collection, followed by the words it left with a reader.'},
    quotes: siteData.quotes.map((group) => ({type: group.type, items: fallbackQuoteItems(group.items)})),
    newsletter: siteData.newsletter,
    featuredHeading: {eyebrow: 'Featured writing', title: 'Featured posts'},
    writings: siteData.writings,
  }
}
