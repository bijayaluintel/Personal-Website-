import {DocumentIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const experiencePage = defineType({
  name: 'experiencePage',
  title: 'Experience Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      initialValue: 'Journey so far',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      initialValue: 'Experience',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Experience Page'}
    },
  },
})
