import {StarFilledIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const awardsPage = defineType({
  name: 'awardsPage',
  title: 'Awards Page',
  type: 'document',
  icon: StarFilledIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      initialValue: 'Awards & recognition',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      initialValue: 'Honours along the way.',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Awards Page'}
    },
  },
})
