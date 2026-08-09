import { type SchemaTypeDefinition } from 'sanity'
import {award} from './award'
import {awardsPage} from './awardsPage'
import {mediaFeature} from './mediaFeature'
import {mediaFeaturesPage} from './mediaFeaturesPage'
import {experience} from './experience'
import {experiencePage} from './experiencePage'
import {writing} from './writing'
import {video} from './video'
import {videosPage} from './videosPage'
import {workPage} from './workPage'
import {workPortfolioItem} from './workPortfolioItem'
import {workService} from './workService'
import {homePage} from './homePage'
import {siteSettings} from './siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    siteSettings,
    awardsPage,
    award,
    mediaFeaturesPage,
    mediaFeature,
    experiencePage,
    experience,
    writing,
    videosPage,
    video,
    workPage,
    workService,
    workPortfolioItem,
    homePage,
  ],
}
