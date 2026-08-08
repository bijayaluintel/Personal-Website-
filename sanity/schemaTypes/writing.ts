import {DocumentTextIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const writing = defineType({
  name: 'writing',
  title: 'Writing Article',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Writing category',
      type: 'string',
      options: {
        list: [
          {title: 'Poetry / कविता', value: 'poems'},
          {title: 'Stories / कथा', value: 'stories'},
          {title: 'Memoirs / संस्मरण', value: 'memoirs'},
          {title: 'Others / अन्य', value: 'others'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: [
          {title: 'Nepali', value: 'ne'},
          {title: 'English', value: 'en'},
          {title: 'Nepali and English', value: 'bilingual'},
        ],
        layout: 'radio',
      },
      initialValue: 'ne',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publication date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Short excerpt',
      type: 'text',
      rows: 4,
      description: 'Displayed on the writing archive and used for search descriptions.',
      validation: (rule) => rule.required().max(320),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'credit',
          title: 'Photo credit (optional)',
          type: 'string',
          description: 'Example: Bruno Abdiel from Pexels. Leave empty when no credit is needed.',
        }),
        defineField({
          name: 'creditUrl',
          title: 'Photo credit link (optional)',
          type: 'url',
          description: 'Link to the photographer, publication, or original image source.',
          validation: (rule) => rule.uri({scheme: ['http', 'https']}),
        }),
      ],
    }),
    defineField({
      name: 'articleVideo',
      title: 'Article YouTube video (optional)',
      type: 'object',
      description: 'Paste a YouTube link here to show a video near the beginning of the article.',
      fields: [
        defineField({
          name: 'url',
          title: 'YouTube video URL',
          type: 'url',
          validation: (rule) =>
            rule.uri({scheme: ['http', 'https']}).custom((value) => {
              if (!value) return true
              try {
                const hostname = new URL(value).hostname.replace(/^www\./, '')
                return hostname === 'youtu.be' || hostname === 'youtube.com' || hostname.endsWith('.youtube.com')
                  ? true
                  : 'Please enter a valid YouTube URL.'
              } catch {
                return 'Please enter a valid YouTube URL.'
              }
            }),
        }),
        defineField({
          name: 'title',
          title: 'Accessible video title',
          type: 'string',
          validation: (rule) => rule.custom((value, context) => {
            const parent = context.parent as {url?: string} | undefined
            return parent?.url && !value ? 'Add a title when a video URL is provided.' : true
          }),
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Article content',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Poem / कविता', value: 'poem'},
            {title: 'Heading 2', value: 'h2'},
            {title: 'Heading 3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],
          marks: {
            annotations: [
              defineArrayMember({
                name: 'link',
                title: 'Link',
                type: 'object',
                fields: [
                  defineField({
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    validation: (rule) =>
                      rule.required().uri({scheme: ['http', 'https', 'mailto']}),
                  }),
                ],
              }),
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          title: 'Article image (between paragraphs)',
          description: 'Insert this image at the exact position where it should appear in the article.',
          options: {hotspot: true},
          validation: (rule) => rule.assetRequired().error('Upload an image file before publishing.'),
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative text',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
            defineField({
              name: 'credit',
              title: 'Photo credit (optional)',
              type: 'string',
              description: 'Leave empty when this image does not require a photo credit.',
            }),
            defineField({
              name: 'creditUrl',
              title: 'Photo credit link (optional)',
              type: 'url',
              description: 'Link to the photographer, publication, or original image source.',
              validation: (rule) => rule.uri({scheme: ['http', 'https']}),
            }),
          ],
        }),
        defineArrayMember({
          name: 'youtubeVideo',
          title: 'YouTube video',
          type: 'object',
          fields: [
            defineField({
              name: 'displayAs',
              title: 'Display as',
              type: 'string',
              options: {
                list: [
                  {title: 'Embedded video', value: 'embed'},
                  {title: 'Clickable link only', value: 'link'},
                ],
                layout: 'radio',
              },
              initialValue: 'embed',
            }),
            defineField({
              name: 'url',
              title: 'YouTube video URL',
              type: 'url',
              description: 'Paste a youtube.com, youtu.be, or YouTube Shorts link.',
              validation: (rule) =>
                rule.required().uri({scheme: ['http', 'https']}).custom((value) => {
                  if (!value) return true
                  try {
                    const hostname = new URL(value).hostname.replace(/^www\./, '')
                    return hostname === 'youtu.be' || hostname === 'youtube.com' || hostname.endsWith('.youtube.com')
                      ? true
                      : 'Please enter a valid YouTube URL.'
                  } catch {
                    return 'Please enter a valid YouTube URL.'
                  }
                }),
            }),
            defineField({
              name: 'title',
              title: 'Accessible video title',
              type: 'string',
              description: 'Describe the video for visitors using screen readers.',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'caption',
              title: 'Caption / link introduction',
              type: 'string',
              description: 'For “Clickable link only”, enter the sentence shown before the URL.',
            }),
          ],
          preview: {
            select: {title: 'title', url: 'url', displayAs: 'displayAs'},
            prepare({title, url, displayAs}) {
              return {
                title,
                subtitle: `${displayAs === 'link' ? 'Link' : 'Embedded video'} · ${url || ''}`,
              }
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  orderings: [
    {
      title: 'Publication date, newest first',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      publishedAt: 'publishedAt',
      media: 'mainImage',
    },
    prepare({title, category, publishedAt, media}) {
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString() : ''
      return {
        title,
        subtitle: [category, date].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
