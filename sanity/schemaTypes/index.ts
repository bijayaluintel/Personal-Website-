import { type SchemaTypeDefinition } from 'sanity'
import {award} from './award'
import {awardsPage} from './awardsPage'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [awardsPage, award],
}
