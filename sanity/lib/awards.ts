import type {SanityImageSource} from '@sanity/image-url'
import {defineQuery} from 'next-sanity'
import {awardsPageData, type AwardItem} from '@/constants/awards'
import {client} from './client'
import {urlFor} from './image'

type AwardsPageResult = {
  hero: {
    eyebrow?: string
    title?: string
  } | null
  awards: Array<{
    _id: string
    title: string
    year: string
    organization: string
    description: string
    image?: SanityImageSource
    imageAlt: string
  }>
}

export type AwardsContent = {
  hero: {
    eyebrow: string
    title: string
  }
  awards: AwardItem[]
}

const AWARDS_PAGE_QUERY = defineQuery(`{
  "hero": *[_type == "awardsPage"][0]{
    eyebrow,
    title
  },
  "awards": *[_type == "award"] | order(displayOrder asc, year desc, _createdAt desc){
    _id,
    title,
    year,
    organization,
    description,
    image,
    imageAlt
  }
}`)

export async function getAwardsContent(): Promise<AwardsContent> {
  try {
    const data = await client.fetch<AwardsPageResult>(
      AWARDS_PAGE_QUERY,
      {},
      {next: {revalidate: 60, tags: ['awards']}},
    )

    return {
      hero: {
        eyebrow: data.hero?.eyebrow || awardsPageData.hero.eyebrow,
        title: data.hero?.title || awardsPageData.hero.title,
      },
      awards:
        data.awards.length > 0
          ? data.awards.map((award, index) => ({
              id: award._id,
              number: String(index + 1).padStart(2, '0'),
              year: award.year,
              title: award.title,
              organization: award.organization,
              description: award.description,
              image: award.image
                ? urlFor(award.image).width(1400).quality(85).auto('format').url()
                : undefined,
              imageAlt: award.imageAlt,
            }))
          : awardsPageData.awards,
    }
  } catch (error) {
    console.error('Unable to load awards from Sanity:', error)
    return awardsPageData
  }
}
