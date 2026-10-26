import {getSiteSettings} from '@/sanity/lib/siteSettings'
import {getMastheadContent} from '@/sanity/lib/home'
import {SiteHeaderClient} from './SiteHeaderClient'

export async function SiteHeader({mastheadTitle, mastheadRoles}: {mastheadTitle?: string; mastheadRoles?: string} = {}) {
  const [settings, masthead] = await Promise.all([
    getSiteSettings(),
    mastheadTitle === undefined ? getMastheadContent() : Promise.resolve({title: mastheadTitle, roles: mastheadRoles || ''}),
  ])
  return <SiteHeaderClient settings={settings} mastheadTitle={masthead.title} mastheadRoles={masthead.roles} />
}
