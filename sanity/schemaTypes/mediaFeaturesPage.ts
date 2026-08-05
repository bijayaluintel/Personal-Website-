import {DocumentsIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const mediaFeaturesPage = defineType({
  name: 'mediaFeaturesPage',
  title: 'Media Features Page',
  type: 'document',
  icon: DocumentsIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      initialValue: 'Published in media',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      initialValue: 'Media Features',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Page description',
      type: 'text',
      rows: 3,
      initialValue:
        'Selected conversations, profiles, and appearances published by newspapers, magazines, and media platforms.',
      validation: (rule) => rule.required().max(300),
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Media Features Page'}
    },
  },
})
