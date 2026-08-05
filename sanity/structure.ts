import {
  DocumentIcon,
  DocumentTextIcon,
  DocumentsIcon,
  StarFilledIcon,
  StarIcon,
  TimelineIcon,
  PlayIcon,
  ComposeIcon,
  ImagesIcon,
} from '@sanity/icons'
import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Awards Page')
        .icon(StarFilledIcon)
        .child(
          S.document()
            .schemaType('awardsPage')
            .documentId('awardsPage'),
        ),
      S.documentTypeListItem('award').title('Awards').icon(StarIcon),
      S.divider(),
      S.listItem()
        .title('Media Features Page')
        .icon(DocumentsIcon)
        .child(
          S.document()
            .schemaType('mediaFeaturesPage')
            .documentId('mediaFeaturesPage'),
        ),
      S.documentTypeListItem('mediaFeature')
        .title('Media Features')
        .icon(DocumentTextIcon),
      S.divider(),
      S.listItem()
        .title('Experience Page')
        .icon(DocumentIcon)
        .child(
          S.document()
            .schemaType('experiencePage')
            .documentId('experiencePage'),
        ),
      S.documentTypeListItem('experience')
        .title('Experience Timeline')
        .icon(TimelineIcon),
      S.divider(),
      S.documentTypeListItem('writing')
        .title('Writing Articles')
        .icon(DocumentTextIcon),
      S.divider(),
      S.listItem()
        .title('Videos Page')
        .icon(PlayIcon)
        .child(
          S.document()
            .schemaType('videosPage')
            .documentId('videosPage'),
        ),
      S.documentTypeListItem('video')
        .title('Videos')
        .icon(PlayIcon),
      S.divider(),
      S.listItem()
        .title('Work & Collaboration Page')
        .icon(DocumentIcon)
        .child(
          S.document()
            .schemaType('workPage')
            .documentId('workPage'),
        ),
      S.documentTypeListItem('workService')
        .title('Work Services')
        .icon(ComposeIcon),
      S.documentTypeListItem('workPortfolioItem')
        .title('Work Portfolio')
        .icon(ImagesIcon),
    ])
