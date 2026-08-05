import {PlayIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const video = defineType({
  name: 'video',
  title: 'Video',
  type: 'document',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Video title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Poetry & Performances', value: 'poetry-performances'},
          {title: 'Podcasts & Interviews', value: 'podcasts'},
          {title: 'Documentaries', value: 'documentaries'},
          {title: 'YouTube Channel', value: 'youtube-channel'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().max(400),
    }),
    defineField({
      name: 'source',
      title: 'Source or series',
      type: 'string',
      description: 'For example: The Poet Idol, Podcast name, or Spoken word.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Video URL',
      type: 'url',
      validation: (rule) => rule.required().uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Custom thumbnail (optional)',
      type: 'image',
      description: 'Leave empty to use the thumbnail from a YouTube URL automatically.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) =>
            rule.custom((value, context) => {
              const parent = context.parent as {asset?: unknown} | undefined
              return parent?.asset && !value
                ? 'Alternative text is required when a custom thumbnail is used.'
                : true
            }),
        }),
      ],
    }),
    defineField({
      name: 'thumbnailAlt',
      title: 'Automatic thumbnail description',
      type: 'string',
      description: 'Used when the thumbnail is generated from the video URL.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers appear first. The first video uses the featured layout.',
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
    select: {title: 'title', category: 'category', source: 'source', media: 'thumbnail'},
    prepare({title, category, source, media}) {
      return {title, subtitle: [category, source].filter(Boolean).join(' · '), media}
    },
  },
})
