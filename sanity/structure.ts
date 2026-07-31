import {StarFilledIcon, StarIcon} from '@sanity/icons'
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
    ])
