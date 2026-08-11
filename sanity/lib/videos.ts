import type {SanityImageSource} from '@sanity/image-url'
import {defineQuery} from 'next-sanity'
import {client} from './client'
import {urlFor} from './image'

export type VideoItem = {number: string; title: string; description: string; source: string; href: string; thumbnail?: string; thumbnailAlt: string}
export type VideoCategory = {slug: string; label: string; eyebrow: string; description: string; channel?: {href: string; handle: string}; items: VideoItem[]}

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

export const videoCategories: CategorySettings[] = [
  {
    _key: 'poetry-performances',
    category: 'poetry-performances',
    label: 'Poetry & Performances',
    eyebrow: 'Poetry in voice',
    description: 'Poems carried beyond the page through live readings, stages, and recorded performances.',
  },
  {
    _key: 'podcasts',
    category: 'podcasts',
    label: 'Podcasts & Interviews',
    eyebrow: 'Listen & watch',
    description: 'Long-form conversations about writing, creativity, literature, and the everyday.',
  },
  {
    _key: 'documentaries',
    category: 'documentaries',
    label: 'Documentaries',
    eyebrow: 'Stories in depth',
    description: 'Documentary films exploring people, places, ideas, and stories with depth and attention.',
  },
  {
    _key: 'youtube-channel',
    category: 'youtube-channel',
    label: 'YouTube Channel',
    eyebrow: 'Latest from the channel',
    description: 'Original poems, spoken-word performances, conversations, and stories from Bijaya Luintel.',
    channelUrl: 'https://www.youtube.com/@bijayaluintel',
    channelHandle: '@bijayaluintel',
  },
]

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

function mapCategory(settings: CategorySettings): VideoCategory {
  return {
    slug: settings.category,
    label: settings.label,
    eyebrow: settings.eyebrow,
    description: settings.description,
    channel:
      settings.channelUrl && settings.channelHandle
        ? {href: settings.channelUrl, handle: settings.channelHandle}
        : undefined,
    items: [],
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

function mergeCategorySettings(settings: CategorySettings[]) {
  return videoCategories.map(
    (fallback) => settings.find((item) => item.category === fallback.category) || fallback,
  )
}

function emptyCategoryContent(categorySlug: string): VideosContent | null {
  const navigation = videoCategories.map(mapCategory)
  const category = navigation.find((item) => item.slug === categorySlug)
  return category ? {category, navigation} : null
}

export async function getVideosContent(categorySlug: string): Promise<VideosContent | null> {
  try {
    const data = await client.withConfig({useCdn: false}).fetch<VideosResult>(
      VIDEOS_QUERY,
      {category: categorySlug},
      {next: {revalidate: 60, tags: ['videos', `videos:${categorySlug}`]}},
    )

    const settings = mergeCategorySettings(data.categories)
    const categorySettings = settings.find((item) => item.category === categorySlug)
    if (!categorySettings) return null
    const category = mapCategory(categorySettings)
    const navigation = settings.map(mapCategory)

    return {
      category: {
        ...category,
        items: data.items.map(mapVideo),
      },
      navigation,
    }
  } catch (error) {
    console.error(`Unable to load ${categorySlug} videos from Sanity:`, error)
    return emptyCategoryContent(categorySlug)
  }
}

export async function getVideoCategoryParams() {
  return videoCategories.map(({category}) => ({category}))
}
