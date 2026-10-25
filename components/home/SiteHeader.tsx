import {getSiteSettings} from '@/sanity/lib/siteSettings'
import {SiteHeaderClient} from './SiteHeaderClient'

export async function SiteHeader({mastheadTitle, mastheadRoles}: {mastheadTitle?: string; mastheadRoles?: string} = {}) {
  const settings = await getSiteSettings()
  return <SiteHeaderClient settings={settings} mastheadTitle={mastheadTitle} mastheadRoles={mastheadRoles} />
}
