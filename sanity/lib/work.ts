import type {SanityImageSource} from '@sanity/image-url'
import {defineQuery} from 'next-sanity'
import {client} from './client'
import {urlFor} from './image'

type ServiceKey = 'scriptwriting' | 'copywriting' | 'songwriting' | 'translations' | 'brand-collaborations'
export type PortfolioVideo = {mediaType?: 'video' | 'image'; number: string; title: string; description: string; source: string; href?: string; thumbnail?: string; thumbnailAlt: string}
type WorkPageResult = {
  page: {heroEyebrow?: string; heroTitle?: string; servicesEyebrow?: string; collaborationEyebrow?: string; collaborationTitle?: string; collaborationDescription?: string} | null
  services: Array<{_id: string; serviceKey: ServiceKey; title: string; description: string; details: string[]; portfolioEyebrow: string; portfolioTitle: string; emptyNote?: string}>
  items: Array<{_id: string; serviceKey: ServiceKey; mediaType: 'video' | 'image'; title: string; source: string; description?: string; url?: string; image?: SanityImageSource & {alt?: string}; thumbnailAlt: string}>
}
export type WorkServiceContent = {id: string; key: ServiceKey; number: string; title: string; description: string; details: string[]; portfolio: {eyebrow: string; title: string; emptyNote: string; items: PortfolioVideo[]}}
export type WorkContent = {hero: {eyebrow: string; title: string}; servicesEyebrow: string; services: WorkServiceContent[]; collaboration: {eyebrow: string; title: string; description: string}}

const WORK_QUERY = defineQuery(/* groq */ `{
  "page": *[_type == "workPage" && _id == "workPage"][0]{heroEyebrow, heroTitle, servicesEyebrow, collaborationEyebrow, collaborationTitle, collaborationDescription},
  "services": *[_type == "workService"] | order(displayOrder asc, _createdAt asc){_id, serviceKey, title, description, details, portfolioEyebrow, portfolioTitle, emptyNote},
  "items": *[_type == "workPortfolioItem"] | order(displayOrder asc, _createdAt asc){_id, serviceKey, mediaType, title, source, description, url, image, thumbnailAlt}
}`)

export async function getWorkContent(): Promise<WorkContent> {
  try {
    const data = await client.fetch<WorkPageResult>(WORK_QUERY, {}, {next: {revalidate: 60, tags: ['work']}})
    return {
      hero: {eyebrow: data.page?.heroEyebrow || '', title: data.page?.heroTitle || ''},
      servicesEyebrow: data.page?.servicesEyebrow || '',
      services: data.services.map((service, index) => ({
        id: service._id,
        key: service.serviceKey,
        number: String(index + 1).padStart(2, '0'),
        title: service.title,
        description: service.description,
        details: service.details,
        portfolio: {
          eyebrow: service.portfolioEyebrow,
          title: service.portfolioTitle,
          emptyNote: service.emptyNote || '',
          items: data.items.filter((item) => item.serviceKey === service.serviceKey).map((item, itemIndex) => ({
            number: String(itemIndex + 1).padStart(2, '0'), mediaType: item.mediaType, title: item.title, description: item.description || '', source: item.source, href: item.url,
            thumbnail: item.image ? urlFor(item.image).width(1400).quality(85).auto('format').url() : undefined,
            thumbnailAlt: item.image?.alt || item.thumbnailAlt,
          })),
        },
      })),
      collaboration: {eyebrow: data.page?.collaborationEyebrow || '', title: data.page?.collaborationTitle || '', description: data.page?.collaborationDescription || ''},
    }
  } catch (error) {
    console.error('Unable to load Work & Collaboration from Sanity:', error)
    return {hero: {eyebrow: '', title: ''}, servicesEyebrow: '', services: [], collaboration: {eyebrow: '', title: '', description: ''}}
  }
}
