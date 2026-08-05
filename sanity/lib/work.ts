import type {SanityImageSource} from '@sanity/image-url'
import {defineQuery} from 'next-sanity'
import {workPageData, type Service} from '@/constants/work'
import {workPortfolioData, type PortfolioVideo} from '@/constants/workPortfolio'
import {client} from './client'
import {urlFor} from './image'

type ServiceKey = Service['key']
type WorkPageResult = {
  page: {heroEyebrow?: string; heroTitle?: string; servicesEyebrow?: string; collaborationEyebrow?: string; collaborationTitle?: string; collaborationDescription?: string} | null
  services: Array<{_id: string; serviceKey: ServiceKey; title: string; description: string; details: string[]; portfolioEyebrow: string; portfolioTitle: string; emptyNote?: string}>
  items: Array<{_id: string; serviceKey: ServiceKey; mediaType: 'video' | 'image'; title: string; source: string; description?: string; url?: string; image?: SanityImageSource & {alt?: string}; thumbnailAlt: string}>
}

export type WorkServiceContent = Service & {
  id?: string
  portfolio: {eyebrow: string; title: string; emptyNote: string; items: PortfolioVideo[]}
}

export type WorkContent = {
  hero: {eyebrow: string; title: string}
  servicesEyebrow: string
  services: WorkServiceContent[]
  collaboration: {eyebrow: string; title: string; description: string}
}

const WORK_QUERY = defineQuery(/* groq */ `{
  "page": *[_type == "workPage" && _id == "workPage"][0]{heroEyebrow, heroTitle, servicesEyebrow, collaborationEyebrow, collaborationTitle, collaborationDescription},
  "services": *[_type == "workService"] | order(displayOrder asc, _createdAt asc){_id, serviceKey, title, description, details, portfolioEyebrow, portfolioTitle, emptyNote},
  "items": *[_type == "workPortfolioItem"] | order(displayOrder asc, _createdAt asc){_id, serviceKey, mediaType, title, source, description, url, image, thumbnailAlt}
}`)

const portfolioFallbacks: Record<ServiceKey, {eyebrow: string; title: string; emptyNote: string; items: PortfolioVideo[]}> = {
  scriptwriting: {eyebrow: workPortfolioData.scriptwriting.eyebrow, title: workPortfolioData.scriptwriting.title, emptyNote: '', items: workPortfolioData.scriptwriting.videos},
  copywriting: {eyebrow: 'Copywriting portfolio', title: 'Words that give an idea its voice.', emptyNote: 'Campaigns, brand stories, and selected copy projects will live here.', items: []},
  songwriting: {eyebrow: 'Songwriting portfolio', title: 'Lyrics, rhythm, and stories made to be heard.', emptyNote: 'Selected songs, lyrics, and listening links will live here.', items: []},
  translations: {eyebrow: workPortfolioData.translation.eyebrow, title: workPortfolioData.translation.title, emptyNote: '', items: workPortfolioData.translation.videos},
  'brand-collaborations': {eyebrow: workPortfolioData.brandCollaborations.eyebrow, title: workPortfolioData.brandCollaborations.title, emptyNote: '', items: workPortfolioData.brandCollaborations.videos},
}

function fallbackContent(): WorkContent {
  return {
    hero: workPageData.hero,
    servicesEyebrow: 'What I do',
    services: workPageData.services.map((service) => ({...service, portfolio: portfolioFallbacks[service.key]})),
    collaboration: workPageData.collaboration,
  }
}

export async function getWorkContent(): Promise<WorkContent> {
  const fallback = fallbackContent()
  try {
    const data = await client.fetch<WorkPageResult>(WORK_QUERY, {}, {next: {revalidate: 60, tags: ['work']}})
    const services = fallback.services.map((fallbackService, index) => {
      const service = data.services.find((item) => item.serviceKey === fallbackService.key)
      const items = data.items.filter((item) => item.serviceKey === fallbackService.key)
      return {
        ...fallbackService,
        id: service?._id,
        number: String(index + 1).padStart(2, '0'),
        title: service?.title || fallbackService.title,
        description: service?.description || fallbackService.description,
        details: service?.details?.length ? service.details : fallbackService.details,
        portfolio: {
          eyebrow: service?.portfolioEyebrow || fallbackService.portfolio.eyebrow,
          title: service?.portfolioTitle || fallbackService.portfolio.title,
          emptyNote: service?.emptyNote || fallbackService.portfolio.emptyNote,
          items: items.length ? items.map((item, itemIndex) => ({
            number: String(itemIndex + 1).padStart(2, '0'),
            mediaType: item.mediaType,
            title: item.title,
            description: item.description || '',
            source: item.source,
            href: item.url,
            thumbnail: item.image ? urlFor(item.image).width(1400).quality(85).auto('format').url() : undefined,
            thumbnailAlt: item.image?.alt || item.thumbnailAlt,
          })) : fallbackService.portfolio.items,
        },
      }
    })
    return {
      hero: {eyebrow: data.page?.heroEyebrow || fallback.hero.eyebrow, title: data.page?.heroTitle || fallback.hero.title},
      servicesEyebrow: data.page?.servicesEyebrow || fallback.servicesEyebrow,
      services,
      collaboration: {
        eyebrow: data.page?.collaborationEyebrow || fallback.collaboration.eyebrow,
        title: data.page?.collaborationTitle || fallback.collaboration.title,
        description: data.page?.collaborationDescription || fallback.collaboration.description,
      },
    }
  } catch (error) {
    console.error('Unable to load Work & Collaboration from Sanity:', error)
    return fallback
  }
}
