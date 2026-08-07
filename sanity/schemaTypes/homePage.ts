import {HomeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

const linkFields = [
  defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
  defineField({name: 'url', title: 'URL', type: 'string', validation: (rule) => rule.required()}),
]

const quoteFields = [
  defineField({name: 'quote', title: 'Text', type: 'text', rows: 3, validation: (rule) => rule.required()}),
  defineField({name: 'source', title: 'Source or reader name', type: 'string', validation: (rule) => rule.required()}),
  defineField({name: 'language', title: 'Language', type: 'string', options: {list: [{title: 'Nepali', value: 'ne'}, {title: 'English', value: 'en'}], layout: 'radio'}, initialValue: 'ne', validation: (rule) => rule.required()}),
]

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'hero', title: 'Hero'},
    {name: 'book', title: 'Book'},
    {name: 'quotes', title: 'Quotes & reader notes'},
    {name: 'newsletter', title: 'Newsletter'},
    {name: 'featured', title: 'Featured posts'},
  ],
  fields: [
    defineField({name: 'heroTitle', title: 'Title', type: 'string', group: 'hero', validation: (rule) => rule.required()}),
    defineField({name: 'heroRoles', title: 'Roles', type: 'string', group: 'hero', validation: (rule) => rule.required()}),
    defineField({name: 'heroTagline', title: 'Tagline', type: 'text', rows: 4, group: 'hero', validation: (rule) => rule.required()}),
    defineField({name: 'heroImage', title: 'Portrait', type: 'image', options: {hotspot: true}, group: 'hero', fields: [defineField({name: 'alt', title: 'Alternative text', type: 'string', validation: (rule) => rule.required()})]}),
    defineField({name: 'heroPrimaryLink', title: 'Primary link', type: 'object', group: 'hero', fields: linkFields}),
    defineField({name: 'heroSecondaryLink', title: 'Secondary link', type: 'object', group: 'hero', fields: linkFields}),

    defineField({name: 'bookTitle', title: 'Book title', type: 'string', group: 'book', validation: (rule) => rule.required()}),
    defineField({name: 'bookDescription', title: 'Book description', type: 'text', rows: 10, group: 'book', validation: (rule) => rule.required()}),
    defineField({name: 'bookCover', title: 'Book cover', type: 'image', options: {hotspot: true}, group: 'book', fields: [defineField({name: 'alt', title: 'Alternative text', type: 'string', validation: (rule) => rule.required()})]}),
    defineField({name: 'bookVideoLabel', title: 'Video label', type: 'string', group: 'book', validation: (rule) => rule.required()}),
    defineField({name: 'bookVideoPrompt', title: 'Video prompt', type: 'string', group: 'book', validation: (rule) => rule.required()}),
    defineField({name: 'bookVideoUrl', title: 'Video URL', type: 'url', group: 'book', validation: (rule) => rule.required().uri({scheme: ['http', 'https']})}),
    defineField({name: 'bookVideoThumbnail', title: 'Custom video thumbnail', type: 'image', description: 'Optional for YouTube videos.', options: {hotspot: true}, group: 'book', fields: [defineField({name: 'alt', title: 'Alternative text', type: 'string'})]}),
    defineField({name: 'bookPrimaryLink', title: 'Primary book link', type: 'object', group: 'book', fields: linkFields}),
    defineField({name: 'bookSecondaryLink', title: 'Secondary book link', type: 'object', group: 'book', fields: linkFields}),

    defineField({name: 'quotesEyebrow', title: 'Section eyebrow', type: 'string', group: 'quotes', validation: (rule) => rule.required()}),
    defineField({name: 'quotesTitle', title: 'Section title', type: 'string', group: 'quotes', validation: (rule) => rule.required()}),
    defineField({name: 'quotesEmphasis', title: 'Emphasized title ending', type: 'string', group: 'quotes'}),
    defineField({name: 'quotesDescription', title: 'Section description', type: 'text', rows: 3, group: 'quotes', validation: (rule) => rule.required()}),
    defineField({name: 'quotesLabel', title: 'Quotes card label', type: 'string', group: 'quotes', initialValue: 'Quotes', validation: (rule) => rule.required()}),
    defineField({name: 'quotes', title: 'Quotes', type: 'array', group: 'quotes', of: [defineArrayMember({name: 'quoteItem', title: 'Quote', type: 'object', fields: quoteFields})], validation: (rule) => rule.required().min(1)}),
    defineField({name: 'readerNotesLabel', title: 'Reader notes card label', type: 'string', group: 'quotes', initialValue: 'Reader’s notes', validation: (rule) => rule.required()}),
    defineField({name: 'readerNotes', title: 'Reader notes', type: 'array', group: 'quotes', of: [defineArrayMember({name: 'readerNote', title: 'Reader note', type: 'object', fields: quoteFields})], validation: (rule) => rule.required().min(1)}),

    defineField({name: 'newsletterEyebrow', title: 'Eyebrow', type: 'string', group: 'newsletter', validation: (rule) => rule.required()}),
    defineField({name: 'newsletterTitle', title: 'Title', type: 'string', group: 'newsletter', validation: (rule) => rule.required()}),
    defineField({name: 'newsletterDescription', title: 'Description', type: 'text', rows: 3, group: 'newsletter', validation: (rule) => rule.required()}),
    defineField({name: 'newsletterPrivacy', title: 'Privacy note', type: 'string', group: 'newsletter', validation: (rule) => rule.required()}),

    defineField({name: 'featuredEyebrow', title: 'Section eyebrow', type: 'string', group: 'featured', initialValue: 'Featured writing', validation: (rule) => rule.required()}),
    defineField({name: 'featuredTitle', title: 'Section title', type: 'string', group: 'featured', initialValue: 'Featured posts', validation: (rule) => rule.required()}),
    defineField({
      name: 'featuredPosts',
      title: 'Featured posts',
      type: 'array',
      group: 'featured',
      validation: (rule) => rule.required().min(1).max(6),
      of: [defineArrayMember({
        name: 'featuredPost',
        title: 'Featured post',
        type: 'object',
        fields: [
          defineField({name: 'contentType', title: 'Content type', type: 'string', options: {list: [{title: 'Writing article', value: 'writing'}, {title: 'Video', value: 'video'}], layout: 'radio'}, initialValue: 'writing', validation: (rule) => rule.required()}),
          defineField({name: 'typeLabel', title: 'Card type label', type: 'string', validation: (rule) => rule.required()}),
          defineField({name: 'writing', title: 'Writing article', type: 'reference', to: [{type: 'writing'}], hidden: ({parent}) => parent?.contentType !== 'writing'}),
          defineField({name: 'videoTitle', title: 'Video title', type: 'string', hidden: ({parent}) => parent?.contentType !== 'video'}),
          defineField({name: 'videoExcerpt', title: 'Video excerpt', type: 'text', rows: 3, hidden: ({parent}) => parent?.contentType !== 'video'}),
          defineField({name: 'videoUrl', title: 'Video URL', type: 'url', hidden: ({parent}) => parent?.contentType !== 'video', validation: (rule) => rule.uri({scheme: ['http', 'https']})}),
          defineField({name: 'videoThumbnail', title: 'Custom video thumbnail', type: 'image', options: {hotspot: true}, hidden: ({parent}) => parent?.contentType !== 'video', fields: [defineField({name: 'alt', title: 'Alternative text', type: 'string'})]}),
        ],
        preview: {select: {type: 'contentType', writingTitle: 'writing.title', videoTitle: 'videoTitle', media: 'videoThumbnail'}, prepare: ({type, writingTitle, videoTitle, media}) => ({title: type === 'writing' ? writingTitle : videoTitle, subtitle: type, media})},
      })],
    }),
  ],
  preview: {prepare: () => ({title: 'Home Page'})},
})
