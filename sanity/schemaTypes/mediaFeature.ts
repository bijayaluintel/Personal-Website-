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
      title: 'Legacy feature image',
      type: 'image',
      options: {hotspot: true},
      description: 'Kept for existing entries. New thumbnails are generated from the published feature URL.',
      hidden: true,
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
    },
    prepare({title, source}) {
      return {title, subtitle: source}
    },
  },
})
