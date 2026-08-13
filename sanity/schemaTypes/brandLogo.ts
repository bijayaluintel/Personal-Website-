import {ImagesIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const brandLogo = defineType({
  name: 'brandLogo',
  title: 'Brand Logo',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'brandName',
      title: 'Brand name',
      type: 'string',
      description: 'Used in Sanity and for accessibility; it is not displayed beside the logo.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          description: 'For example: Acme brand logo.',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display order',
      type: 'number',
      initialValue: 100,
      validation: (rule) => rule.required().integer().min(0),
    }),
  ],
  orderings: [
    {title: 'Display order', name: 'displayOrderAsc', by: [{field: 'displayOrder', direction: 'asc'}]},
  ],
  preview: {select: {title: 'brandName', media: 'logo'}},
})
