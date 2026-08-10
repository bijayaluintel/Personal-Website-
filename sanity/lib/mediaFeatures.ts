import type {SanityImageSource} from '@sanity/image-url'
import {defineQuery} from 'next-sanity'
import {client} from './client'
import {urlFor} from './image'

export type MediaFeatureItem = {
  id: string
  number: string
  title: string
  description: string
  source: string
  href?: string
  image?: string
  imageAlt: string
}

type MediaFeaturesResult = {
  page: {
    eyebrow?: string
    title?: string
    description?: string
  } | null
  items: Array<{
    _id: string
    title: string
    source: string
    description: string
    url: string
    image?: SanityImageSource
    imageAlt: string
  }>
}

export type MediaFeaturesContent = {
  eyebrow: string
  label: string
  description: string
  items: MediaFeatureItem[]
}

const MEDIA_FEATURES_QUERY = defineQuery(/* groq */ `{
  "page": *[_type == "mediaFeaturesPage"][0]{
    eyebrow,
    title,
    description
  },
  "items": *[_type == "mediaFeature"] | order(displayOrder asc, _createdAt desc){
    _id,
    title,
    source,
    description,
    url,
    image,
    imageAlt
  }
}`)

export async function getMediaFeaturesContent(): Promise<MediaFeaturesContent> {
  try {
    const data = await client.fetch<MediaFeaturesResult>(
      MEDIA_FEATURES_QUERY,
      {},
      {next: {revalidate: 60, tags: ['media-features']}},
    )

    return {
      eyebrow: data.page?.eyebrow || '',
      label: data.page?.title || '',
      description: data.page?.description || '',
      items:
        data.items.length > 0
          ? data.items.map((item, index) => ({
              id: item._id,
              number: String(index + 1).padStart(2, '0'),
              title: item.title,
              source: item.source,
              description: item.description,
              href: item.url,
              image: item.image
                ? urlFor(item.image).width(1600).quality(85).auto('format').url()
                : undefined,
              imageAlt: item.imageAlt,
            }))
          : [],
    }
  } catch (error) {
    console.error('Unable to load media features from Sanity:', error)
    return {eyebrow: '', label: '', description: '', items: []}
  }
}
