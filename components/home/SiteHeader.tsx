import {getSiteSettings} from '@/sanity/lib/siteSettings'
import {SiteHeaderClient} from './SiteHeaderClient'

export async function SiteHeader() {
  const settings = await getSiteSettings()
  return <SiteHeaderClient settings={settings} />
}
