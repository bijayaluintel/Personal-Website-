import {ImagesIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {workServiceOptions} from './workService'

export const workPortfolioItem = defineType({
  name: 'workPortfolioItem',
  title: 'Work Portfolio Item',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({name: 'serviceKey', title: 'Service', type: 'string', options: {list: workServiceOptions}, validation: (rule) => rule.required()}),
    defineField({name: 'mediaType', title: 'Media type', type: 'string', options: {list: [{title: 'Video', value: 'video'}, {title: 'Image', value: 'image'}], layout: 'radio'}, initialValue: 'video', validation: (rule) => rule.required()}),
    defineField({name: 'title', title: 'Project title', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'source', title: 'Series, client, or source', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'description', title: 'Internal project note', type: 'text', rows: 3, description: 'Saved for future layouts; the current compact cards do not display it.'}),
    defineField({
      name: 'url',
      title: 'Video or project URL',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}).custom((value, context) => context.document?.mediaType === 'video' && !value ? 'A URL is required for videos.' : true),
    }),
    defineField({
      name: 'image',
      title: 'Image or custom thumbnail',
      type: 'image',
      options: {hotspot: true},
      validation: (rule) => rule.custom((value, context) => context.document?.mediaType === 'image' && !value ? 'Upload an image for image projects.' : true),
      fields: [defineField({name: 'alt', title: 'Alternative text', type: 'string'})],
    }),
    defineField({name: 'thumbnailAlt', title: 'Thumbnail description', type: 'string', description: 'Used for automatic YouTube thumbnails and as a fallback for uploaded images.', validation: (rule) => rule.required()}),
    defineField({name: 'displayOrder', title: 'Display order', type: 'number', initialValue: 100, validation: (rule) => rule.required().integer().min(0)}),
  ],
  orderings: [{title: 'Display order', name: 'displayOrderAsc', by: [{field: 'displayOrder', direction: 'asc'}]}],
  preview: {select: {title: 'title', service: 'serviceKey', media: 'image'}, prepare: ({title, service, media}) => ({title, subtitle: service, media})},
})
