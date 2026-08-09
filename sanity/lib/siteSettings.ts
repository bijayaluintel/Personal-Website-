import {defineQuery} from 'next-sanity'
import {siteData, type NavigationItem} from '@/constants/home'
import {client} from './client'

type SanityLink = {label?: string; url?: string}
type SanityNavigationItem = SanityLink & {children?: SanityLink[]}

export type SiteSettings = {
  siteName: string
  shortName: string
  roleLabel: string
  email: string
  navigation: NavigationItem[]
  contactButtonLabel: string
  footerPrompt: string
  socialHeading: string
  socialLinks: Array<{label: string; href: string}>
  copyrightName: string
  backToTopLabel: string
}

type SiteSettingsDocument = {
  siteName?: string
  shortName?: string
  roleLabel?: string
  email?: string
  navigation?: SanityNavigationItem[]
  contactButtonLabel?: string
  footerPrompt?: string
  socialHeading?: string
  socialLinks?: SanityLink[]
  copyrightName?: string
  backToTopLabel?: string
}

const SITE_SETTINGS_QUERY = defineQuery(/* groq */ `
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    siteName,
    shortName,
    roleLabel,
    email,
    navigation[]{label, url, children[]{label, url}},
    contactButtonLabel,
    footerPrompt,
    socialHeading,
    socialLinks[]{label, url},
    copyrightName,
    backToTopLabel
  }
`)

const fallback: SiteSettings = {
  siteName: siteData.name,
  shortName: siteData.shortName,
  roleLabel: 'Writer & storyteller',
  email: siteData.email,
  navigation: siteData.nav,
  contactButtonLabel: 'Work with me',
  footerPrompt: 'Have a thought to share?',
  socialHeading: 'Follow along',
  socialLinks: siteData.socialLinks,
  copyrightName: 'Bijaya Luintel',
  backToTopLabel: 'Back to top ↑',
}

function validLink<T extends SanityLink>(link: T): link is T & {label: string; url: string} {
  return Boolean(link.label && link.url)
}

function mapSettings(document: SiteSettingsDocument | null): SiteSettings {
  if (!document) return fallback

  const navigation = document.navigation
    ?.filter(validLink)
    .map((item) => ({
      label: item.label,
      href: item.url,
      children: item.children?.filter(validLink).map((child) => ({label: child.label, href: child.url})),
    }))

  return {
    siteName: document.siteName || fallback.siteName,
    shortName: document.shortName || fallback.shortName,
    roleLabel: document.roleLabel || fallback.roleLabel,
    email: document.email || fallback.email,
    navigation: navigation?.length ? navigation : fallback.navigation,
    contactButtonLabel: document.contactButtonLabel || fallback.contactButtonLabel,
    footerPrompt: document.footerPrompt || fallback.footerPrompt,
    socialHeading: document.socialHeading || fallback.socialHeading,
    socialLinks: document.socialLinks?.filter(validLink).map((link) => ({label: link.label, href: link.url})) || fallback.socialLinks,
    copyrightName: document.copyrightName || fallback.copyrightName,
    backToTopLabel: document.backToTopLabel || fallback.backToTopLabel,
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const document = await client.fetch<SiteSettingsDocument | null>(
      SITE_SETTINGS_QUERY,
      {},
      {next: {revalidate: 60, tags: ['site-settings']}},
    )
    return mapSettings(document)
  } catch (error) {
    console.error('Unable to load header and footer from Sanity:', error)
    return fallback
  }
}
