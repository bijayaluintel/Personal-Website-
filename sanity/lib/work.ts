import type {SanityImageSource} from '@sanity/image-url'
import {defineQuery} from 'next-sanity'
import {client} from './client'
import {urlFor} from './image'

export type ServiceKey = string
export type PortfolioVideo = {mediaType?: 'video' | 'image'; number: string; title: string; description: string; source: string; href?: string; thumbnail?: string; thumbnailAlt: string}
export type BrandLogo = {id: string; brandName: string; image: string; imageAlt: string}
type WorkPageResult = {
  page: {heroEyebrow?: string; heroTitle?: string; servicesEyebrow?: string; collaborationEyebrow?: string; collaborationTitle?: string; collaborationDescription?: string} | null
  services: Array<{_id: string; serviceKey: ServiceKey; title: string; description: string; details: string[]; portfolioEyebrow: string; portfolioTitle: string; emptyNote?: string}>
  items: Array<{_id: string; serviceKey: ServiceKey; mediaType: 'video' | 'image'; title: string; source: string; description?: string; url?: string; image?: SanityImageSource & {asset?: unknown; alt?: string}; thumbnailAlt: string}>
  brandLogos: Array<{_id: string; brandName: string; logo: SanityImageSource & {asset?: unknown; alt?: string}}>
}
export type WorkServiceContent = {id: string; key: ServiceKey; number: string; title: string; description: string; details: string[]; portfolio: {eyebrow: string; title: string; emptyNote: string; items: PortfolioVideo[]}}
export type WorkContent = {hero: {eyebrow: string; title: string}; servicesEyebrow: string; services: WorkServiceContent[]; brandLogos: BrandLogo[]; collaboration: {eyebrow: string; title: string; description: string}}

const WORK_QUERY = defineQuery(/* groq */ `{
  "page": *[_type == "workPage" && _id == "workPage"][0]{heroEyebrow, heroTitle, servicesEyebrow, collaborationEyebrow, collaborationTitle, collaborationDescription},
  "services": *[_type == "workService"] | order(displayOrder asc, _createdAt asc){_id, serviceKey, title, description, details, portfolioEyebrow, portfolioTitle, emptyNote},
  "items": *[_type == "workPortfolioItem"] | order(displayOrder asc, _createdAt asc){_id, serviceKey, mediaType, title, source, description, url, image, thumbnailAlt},
  "brandLogos": *[_type == "brandLogo" && defined(logo.asset)] | order(displayOrder asc, _createdAt asc){_id, brandName, logo}
}`)

export async function getWorkContent(): Promise<WorkContent> {
  try {
    const data = await client.withConfig({useCdn: false}).fetch<WorkPageResult>(WORK_QUERY, {}, {next: {revalidate: 60, tags: ['work']}})
    return {
      hero: {eyebrow: data.page?.heroEyebrow || '', title: data.page?.heroTitle || ''},
      servicesEyebrow: data.page?.servicesEyebrow || '',
      services: data.services.map((service, index) => ({
        id: service._id,
        key: service.serviceKey,
        number: String(index + 1).padStart(2, '0'),
        title: service.serviceKey === 'songwriting' ? 'Lyrics writing' : service.title,
        description: service.description,
        details: service.details,
        portfolio: {
          eyebrow: service.portfolioEyebrow,
          title: service.portfolioTitle,
          emptyNote: service.emptyNote || '',
          items: data.items.filter((item) => item.serviceKey === service.serviceKey).map((item, itemIndex) => ({
            number: String(itemIndex + 1).padStart(2, '0'), mediaType: item.mediaType, title: item.title, description: item.description || '', source: item.source, href: item.url,
            thumbnail: item.image?.asset ? urlFor(item.image).width(1400).quality(85).auto('format').url() : undefined,
            thumbnailAlt: item.image?.alt || item.thumbnailAlt,
          })),
        },
      })),
      brandLogos: data.brandLogos.map((brand) => ({
        id: brand._id,
        brandName: brand.brandName,
        image: urlFor(brand.logo).width(800).height(500).fit('max').quality(90).auto('format').url(),
        imageAlt: brand.logo.alt || `${brand.brandName} logo`,
      })),
      collaboration: {eyebrow: data.page?.collaborationEyebrow || '', title: data.page?.collaborationTitle || '', description: data.page?.collaborationDescription || ''},
    }
  } catch (error) {
    console.error('Unable to load Work & Collaboration from Sanity:', error)
    return {hero: {eyebrow: '', title: ''}, servicesEyebrow: '', services: [], brandLogos: [], collaboration: {eyebrow: '', title: '', description: ''}}
  }
}

export async function getWorkServiceParams() {
  try {
    const services = await client.withConfig({useCdn: false}).fetch<Array<{serviceKey: string}>>(
      defineQuery(`*[_type == "workService" && defined(serviceKey)]{serviceKey}`),
    )
    return services.map(({serviceKey}) => ({service: serviceKey}))
  } catch (error) {
    console.error('Unable to load Work & Collaboration routes from Sanity:', error)
    return []
  }
}
