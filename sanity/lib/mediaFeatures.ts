import type {SanityImageSource} from '@sanity/image-url'
import {defineQuery} from 'next-sanity'
import {client} from './client'
import {urlFor} from './image'
import {getLinkPreview} from './linkPreview'

export type MediaFeatureItem = {
  id: string
  number: string
  title: string
  description: string
  source: string
  href?: string
  image?: string
  mediaType?: 'image' | 'video'
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
    image?: SanityImageSource & {asset?: unknown; alt?: string}
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

function escapeXml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
  })[character] || character)
}

function generatedThumbnail(source: string) {
  const label = escapeXml(source.trim().slice(0, 42) || 'Media feature')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675"><rect width="1200" height="675" fill="#e9e5dc"/><circle cx="600" cy="250" r="104" fill="#1f231e"/><text x="600" y="275" fill="#faf8f3" font-family="Georgia,serif" font-size="70" text-anchor="middle">BL</text><text x="600" y="430" fill="#a95335" font-family="Arial,sans-serif" font-size="24" font-weight="700" letter-spacing="5" text-anchor="middle">MEDIA FEATURE</text><text x="600" y="495" fill="#1f231e" font-family="Georgia,serif" font-size="42" text-anchor="middle">${label}</text></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export async function getMediaFeaturesContent(): Promise<MediaFeaturesContent> {
  try {
    const data = await client.withConfig({useCdn: false}).fetch<MediaFeaturesResult>(
      MEDIA_FEATURES_QUERY,
      {},
      {next: {revalidate: 60, tags: ['media-features']}},
    )

    return {
      eyebrow: data.page?.eyebrow || '',
      label: data.page?.title || '',
      description: data.page?.description || '',
      items: await Promise.all(
        data.items.map(async (item, index) => {
          const customImage = item.image?.asset
            ? urlFor(item.image).width(1600).quality(85).auto('format').url()
            : undefined
          const automaticPreview = customImage ? undefined : await getLinkPreview(item.url)
          const resolvedImage = customImage || automaticPreview?.url || generatedThumbnail(item.source)

          return {
            id: item._id,
            number: String(index + 1).padStart(2, '0'),
            title: item.title,
            source: item.source,
            description: item.description,
            href: item.url,
            image: resolvedImage,
            mediaType: customImage ? 'image' : automaticPreview?.type || 'image',
            imageAlt: item.image?.alt || item.imageAlt || `${item.title} preview`,
          }
        }),
      ),
    }
  } catch (error) {
    console.error('Unable to load media features from Sanity:', error)
    return {eyebrow: '', label: '', description: '', items: []}
  }
}
