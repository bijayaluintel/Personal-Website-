import {ComposeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

const services = [
  {title: 'Scriptwriting', value: 'scriptwriting'},
  {title: 'Copywriting', value: 'copywriting'},
  {title: 'Songwriting', value: 'songwriting'},
  {title: 'Translations', value: 'translations'},
  {title: 'Brand collaborations', value: 'brand-collaborations'},
]

export const workService = defineType({
  name: 'workService',
  title: 'Work Service',
  type: 'document',
  icon: ComposeIcon,
  fields: [
    defineField({name: 'serviceKey', title: 'Service type', type: 'string', options: {list: services}, validation: (rule) => rule.required()}),
    defineField({name: 'title', title: 'Navigation title', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'description', title: 'Service description', type: 'text', rows: 3, validation: (rule) => rule.required().max(300)}),
    defineField({name: 'details', title: 'Areas of work', type: 'array', of: [defineArrayMember({type: 'string'})], validation: (rule) => rule.required().min(1).max(6).unique()}),
    defineField({name: 'portfolioEyebrow', title: 'Portfolio eyebrow', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'portfolioTitle', title: 'Portfolio title', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'emptyNote', title: 'Empty portfolio note', type: 'text', rows: 2, description: 'Shown when this service has no portfolio items.'}),
    defineField({name: 'displayOrder', title: 'Display order', type: 'number', initialValue: 100, validation: (rule) => rule.required().integer().min(0)}),
  ],
  orderings: [{title: 'Display order', name: 'displayOrderAsc', by: [{field: 'displayOrder', direction: 'asc'}]}],
  preview: {select: {title: 'title', subtitle: 'serviceKey'}},
})

export {services as workServiceOptions}
