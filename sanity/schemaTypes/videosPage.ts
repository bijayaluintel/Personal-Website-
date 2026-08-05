import {PlayIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

const categoryOptions = [
  {title: 'Poetry & Performances', value: 'poetry-performances'},
  {title: 'Podcasts & Interviews', value: 'podcasts'},
  {title: 'Documentaries', value: 'documentaries'},
  {title: 'YouTube Channel', value: 'youtube-channel'},
]

export const videosPage = defineType({
  name: 'videosPage',
  title: 'Videos Page',
  type: 'document',
  icon: PlayIcon,
  initialValue: {
    categories: [
      {
        _type: 'videoCategorySettings',
        category: 'poetry-performances',
        label: 'Poetry & Performances',
        eyebrow: 'Poetry in voice',
        description:
          'Poems carried beyond the page through live readings, stages, and recorded performances.',
      },
      {
        _type: 'videoCategorySettings',
        category: 'podcasts',
        label: 'Podcasts & Interviews',
        eyebrow: 'Listen & watch',
        description:
          'Long-form conversations about writing, creativity, literature, and the everyday.',
      },
      {
        _type: 'videoCategorySettings',
        category: 'documentaries',
        label: 'Documentaries',
        eyebrow: 'Stories in depth',
        description:
          'Documentary films exploring people, places, ideas, and stories with depth and attention.',
      },
      {
        _type: 'videoCategorySettings',
        category: 'youtube-channel',
        label: 'YouTube Channel',
        eyebrow: 'Latest from the channel',
        description:
          'Original poems, spoken-word performances, conversations, and stories from Bijaya Luintel.',
        channelUrl: 'https://www.youtube.com/@bijayaluintel',
        channelHandle: '@bijayaluintel',
      },
    ],
  },
  fields: [
    defineField({
      name: 'categories',
      title: 'Video category headings',
      type: 'array',
      description: 'Add each category once and drag them into the desired navigation order.',
      validation: (rule) => rule.required().min(4).max(4).unique(),
      of: [
        defineArrayMember({
          name: 'videoCategorySettings',
          title: 'Video category',
          type: 'object',
          fields: [
            defineField({
              name: 'category',
              title: 'Category',
              type: 'string',
              options: {list: categoryOptions},
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Page title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'eyebrow',
              title: 'Eyebrow',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required().max(300),
            }),
            defineField({
              name: 'channelUrl',
              title: 'YouTube channel URL',
              type: 'url',
              hidden: ({parent}) => parent?.category !== 'youtube-channel',
              validation: (rule) => rule.uri({scheme: ['http', 'https']}),
            }),
            defineField({
              name: 'channelHandle',
              title: 'YouTube channel handle',
              type: 'string',
              hidden: ({parent}) => parent?.category !== 'youtube-channel',
            }),
          ],
          preview: {
            select: {title: 'label', subtitle: 'eyebrow'},
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Videos Page'}
    },
  },
})
