import type {SanityImageSource} from '@sanity/image-url'
import {defineQuery} from 'next-sanity'
import {
  getVideoCategory,
  getVideoCategoryNavigation,
  type VideoCategory,
  type VideoItem,
} from '@/constants/videos'
import {client} from './client'
import {urlFor} from './image'

type CategorySettings = {
  _key: string
  category: string
  label: string
  eyebrow: string
  description: string
  channelUrl?: string
  channelHandle?: string
}

type VideoDocument = {
  _id: string
  title: string
  description: string
  source: string
  url: string
  thumbnail?: SanityImageSource & {alt?: string}
  thumbnailAlt: string
}

type VideosResult = {
  categories: CategorySettings[]
  items: VideoDocument[]
}

export type VideosContent = {
  category: VideoCategory
  navigation: VideoCategory[]
}

const VIDEOS_QUERY = defineQuery(/* groq */ `{
  "categories": coalesce(
    *[_type == "videosPage" && _id == "videosPage"][0].categories[]{
      _key,
      category,
      label,
      eyebrow,
      description,
      channelUrl,
      channelHandle
    },
    []
  ),
  "items": *[_type == "video" && category == $category]
    | order(displayOrder asc, _createdAt asc){
      _id,
      title,
      description,
      source,
      url,
      thumbnail,
      thumbnailAlt
    }
}`)

function mergeCategory(settings: CategorySettings, fallback: VideoCategory): VideoCategory {
  return {
    ...fallback,
    label: settings.label || fallback.label,
    eyebrow: settings.eyebrow || fallback.eyebrow,
    description: settings.description || fallback.description,
    channel:
      settings.channelUrl && settings.channelHandle
        ? {href: settings.channelUrl, handle: settings.channelHandle}
        : fallback.channel,
  }
}

function mapVideo(item: VideoDocument, index: number): VideoItem {
  return {
    number: String(index + 1).padStart(2, '0'),
    title: item.title,
    description: item.description,
    source: item.source,
    href: item.url,
    thumbnail: item.thumbnail
      ? urlFor(item.thumbnail).width(1280).height(720).fit('crop').quality(85).auto('format').url()
      : undefined,
    thumbnailAlt: item.thumbnail?.alt || item.thumbnailAlt,
  }
}

export async function getVideosContent(categorySlug: string): Promise<VideosContent | null> {
  const fallbackCategory = getVideoCategory(categorySlug)
  if (!fallbackCategory) return null

  try {
    const data = await client.fetch<VideosResult>(
      VIDEOS_QUERY,
      {category: categorySlug},
      {next: {revalidate: 60, tags: ['videos', `videos:${categorySlug}`]}},
    )

    const categorySettings = data.categories.find((item) => item.category === categorySlug)
    const category = categorySettings
      ? mergeCategory(categorySettings, fallbackCategory)
      : fallbackCategory
    const navigation = getVideoCategoryNavigation().map((fallback) => {
      const settings = data.categories.find((item) => item.category === fallback.slug)
      return settings ? mergeCategory(settings, fallback) : fallback
    })

    return {
      category: {
        ...category,
        items: data.items.length > 0 ? data.items.map(mapVideo) : fallbackCategory.items,
      },
      navigation,
    }
  } catch (error) {
    console.error(`Unable to load ${categorySlug} videos from Sanity:`, error)
    return {category: fallbackCategory, navigation: getVideoCategoryNavigation()}
  }
}
