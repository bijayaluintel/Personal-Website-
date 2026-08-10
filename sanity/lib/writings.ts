import type {PortableTextBlock} from '@portabletext/types'
import type {SanityImageSource} from '@sanity/image-url'
import {defineQuery} from 'next-sanity'
import {client} from './client'
import {urlFor} from './image'

export const writingCategories = [
  {slug: 'poems', label: 'कविता', eyebrow: 'कविता सङ्ग्रह', description: 'समय, प्रेम, यात्रा र जीवनका सूक्ष्म अनुभूतिहरूलाई समेटिएका कविताहरू।'},
  {slug: 'stories', label: 'कथा', eyebrow: 'कथा सङ्ग्रह', description: 'मानिस, सम्बन्ध र दैनिक जीवनका अनौठा मोडहरूबाट जन्मिएका छोटा तथा लामा कथाहरू।'},
  {slug: 'memoirs', label: 'संस्मरण', eyebrow: 'यात्रा र सम्झना', description: 'यात्रामा भेटिएका ठाउँ, मानिस र मनमा बाँकी बसेका स्मृतिका व्यक्तिगत अभिलेखहरू।'},
  {slug: 'others', label: 'अन्य', eyebrow: 'अन्य रचना', description: 'निबन्ध, विचार, टिप्पणी र अन्य विधामा लेखिएका विविध रचनाहरू।'},
] as const

export type WritingCategory = (typeof writingCategories)[number]

export function getWritingCategory(slug: string) {
  return writingCategories.find((category) => category.slug === slug)
}

export type WritingBodyImage = {
  _key: string
  _type: 'image'
  asset: SanityImageSource
  alt: string
  caption?: string
  credit?: string
  creditUrl?: string
  alignment?: 'left' | 'center' | 'right'
  size?: 'small' | 'medium' | 'large'
  crop?: SanityImageSource
  hotspot?: SanityImageSource
}

export type WritingBodyVideo = {
  _key?: string
  _type?: 'youtubeVideo'
  url: string
  title: string
  caption?: string
  displayAs?: 'embed' | 'link'
  alignment?: 'left' | 'center' | 'right'
  size?: 'small' | 'medium' | 'large'
}

export type WritingPost = {
  id: string
  title: string
  publishedAt: string
  slug: string
  excerpt: string
  image?: string
  imageAlt: string
  imageCredit?: string
  imageCreditUrl?: string
  video?: WritingBodyVideo
  body?: Array<PortableTextBlock | WritingBodyImage | WritingBodyVideo>
}

type WritingDocument = {
  _id: string
  title: string
  publishedAt: string
  slug: string
  excerpt: string
  mainImage?: SanityImageSource & {alt?: string; credit?: string; creditUrl?: string}
  articleVideo?: WritingBodyVideo
  body?: Array<PortableTextBlock | WritingBodyImage | WritingBodyVideo>
}

const WRITING_LIST_QUERY = defineQuery(/* groq */ `
  *[_type == "writing" && category == $category && defined(slug.current)]
    | order(publishedAt desc, _createdAt desc){
      _id,
      title,
      publishedAt,
      "slug": slug.current,
      excerpt,
      mainImage,
      articleVideo
    }
`)

const WRITING_POST_QUERY = defineQuery(/* groq */ `
  *[
    _type == "writing" &&
    category == $category &&
    slug.current == $slug
  ][0]{
    _id,
    title,
    publishedAt,
    "slug": slug.current,
    excerpt,
    mainImage,
    articleVideo,
    body[]{
      ...
    }
  }
`)

const WRITING_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "writing" && defined(slug.current)]{
    category,
    "slug": slug.current
  }
`)

function mapWriting(document: WritingDocument): WritingPost {
  return {
    id: document._id,
    title: document.title,
    publishedAt: document.publishedAt,
    slug: document.slug,
    excerpt: document.excerpt,
    image: document.mainImage
      ? urlFor(document.mainImage).width(1600).quality(85).auto('format').url()
      : undefined,
    imageAlt: document.mainImage?.alt || '',
    imageCredit: document.mainImage?.credit,
    imageCreditUrl: document.mainImage?.creditUrl,
    video: document.articleVideo?.url ? document.articleVideo : undefined,
    body: document.body,
  }
}

export async function getWritingPosts(category: WritingCategory): Promise<WritingPost[]> {
  try {
    const documents = await client.fetch<WritingDocument[]>(
      WRITING_LIST_QUERY,
      {category: category.slug},
      {next: {revalidate: 60, tags: ['writings', `writings:${category.slug}`]}},
    )
    return documents.map(mapWriting)
  } catch (error) {
    console.error(`Unable to load ${category.slug} from Sanity:`, error)
    return []
  }
}

export async function getWritingPost(category: string, slug: string): Promise<WritingPost | null> {
  let normalizedSlug = slug

  try {
    normalizedSlug = decodeURIComponent(slug)
  } catch {
    // Keep the original value when the route segment is not URI encoded.
  }

  try {
    const document = await client.withConfig({useCdn: false}).fetch<WritingDocument | null>(
      WRITING_POST_QUERY,
      {category, slug: normalizedSlug},
      {next: {revalidate: 60, tags: ['writings', `writing:${normalizedSlug}`]}},
    )
    return document ? mapWriting(document) : null
  } catch (error) {
    console.error(`Unable to load writing ${normalizedSlug} from Sanity:`, error)
    return null
  }
}

export async function getWritingStaticParams() {
  try {
    return await client.withConfig({useCdn: false}).fetch<
      Array<{category: string; slug: string}>
    >(WRITING_SLUGS_QUERY)
  } catch (error) {
    console.error('Unable to load writing routes from Sanity:', error)
    return []
  }
}
