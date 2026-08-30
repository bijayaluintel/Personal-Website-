import type {SanityImageSource} from '@sanity/image-url'
import {defineQuery} from 'next-sanity'
import {client} from './client'
import {urlFor} from './image'

type SanityLink = {label?: string; url?: string}
type SanityNavigationItem = SanityLink & {children?: SanityLink[]}
export type NavigationItem = {label: string; href: string; children?: Array<{label: string; href: string}>}
type HeaderLogo = SanityImageSource & {asset?: unknown; alt?: string}
export type SiteSettings = {siteName: string; shortName: string; roleLabel: string; email: string; headerLogoUrl: string; headerLogoAlt: string; navigation: NavigationItem[]; contactButtonLabel: string; footerPrompt: string; socialHeading: string; socialLinks: Array<{label: string; href: string}>; copyrightName: string; backToTopLabel: string}
type SiteSettingsDocument = {siteName?: string; shortName?: string; roleLabel?: string; email?: string; headerLogo?: HeaderLogo; navigation?: SanityNavigationItem[]; contactButtonLabel?: string; footerPrompt?: string; socialHeading?: string; socialLinks?: SanityLink[]; copyrightName?: string; backToTopLabel?: string}

const SITE_SETTINGS_QUERY = defineQuery(/* groq */ `*[_type == "siteSettings" && _id == "siteSettings"][0]{siteName, shortName, roleLabel, email, headerLogo{asset, alt, crop, hotspot}, navigation[]{label, url, children[]{label, url}}, contactButtonLabel, footerPrompt, socialHeading, socialLinks[]{label, url}, copyrightName, backToTopLabel}`)

function validLink<T extends SanityLink>(link: T): link is T & {label: string; url: string} {
  return Boolean(link.label && link.url)
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const document = await client.fetch<SiteSettingsDocument | null>(SITE_SETTINGS_QUERY, {}, {next: {revalidate: 60, tags: ['site-settings']}})
  if (!document) throw new Error('The Sanity siteSettings singleton is missing.')
  return {
    siteName: document.siteName || '', shortName: document.shortName || '', roleLabel: document.roleLabel || '', email: document.email || '',
    headerLogoUrl: document.headerLogo?.asset ? urlFor(document.headerLogo).width(156).height(156).fit('max').quality(90).auto('format').url() : '/navbar-logo-tight.png',
    headerLogoAlt: document.headerLogo?.alt || `${document.siteName || 'Site'} logo`,
    navigation: (document.navigation || []).filter(validLink).map((item) => ({label: item.label, href: item.url, children: item.children?.filter(validLink).map((child) => ({label: child.label, href: child.url}))})),
    contactButtonLabel: document.contactButtonLabel || '', footerPrompt: document.footerPrompt || '', socialHeading: document.socialHeading || '',
    socialLinks: (document.socialLinks || []).filter(validLink).map((item) => ({label: item.label, href: item.url})), copyrightName: document.copyrightName || '', backToTopLabel: document.backToTopLabel || '',
  }
}
