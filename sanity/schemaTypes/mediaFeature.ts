import {DocumentTextIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const mediaFeature = defineType({
  name: 'mediaFeature',
  title: 'Media Feature',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Feature title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'source',
      title: 'Publication or media platform',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required().max(500),
    }),
    defineField({
      name: 'url',
      title: 'Published feature URL',
      type: 'url',
      validation: (rule) => rule.required().uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'image',
      title: 'Custom thumbnail (optional)',
      type: 'image',
      options: {hotspot: true},
      description: 'Upload only when you want to override the automatic URL thumbnail or when no thumbnail can be generated.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          description: 'Briefly describe the thumbnail for visitors using screen readers.',
          validation: (rule) =>
            rule.custom((value, context) => {
              const parent = context.parent as {asset?: unknown} | undefined
              return parent?.asset && !value ? 'Alternative text is required for a custom thumbnail.' : true
            }),
        }),
      ],
    }),
    defineField({
      name: 'imageAlt',
      title: 'Legacy image description',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers appear first. The first item uses the featured layout.',
      initialValue: 100,
      validation: (rule) => rule.required().integer().min(0),
    }),
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'displayOrderAsc',
      by: [{field: 'displayOrder', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      source: 'source',
      media: 'image',
    },
    prepare({title, source, media}) {
      return {title, subtitle: source, media}
    },
  },
})
