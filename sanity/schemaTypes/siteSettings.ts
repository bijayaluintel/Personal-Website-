import {CogIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

const linkFields = [
  defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
  defineField({
    name: 'url',
    title: 'URL',
    type: 'string',
    description: 'Use / for an internal page, or a complete https:// URL for an external page.',
    validation: (rule) => rule.required(),
  }),
]

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Header & Footer',
  type: 'document',
  icon: CogIcon,
  initialValue: {
    siteName: 'Bijaya Luintel',
    shortName: 'BL',
    roleLabel: 'Writer & storyteller',
    email: 'hello@bijayaluintel.com',
    contactButtonLabel: 'Work with me',
    footerPrompt: 'Have a thought to share?',
    socialHeading: 'Follow along',
    copyrightName: 'Bijaya Luintel',
    backToTopLabel: 'Back to top ↑',
    navigation: [
      {_key: 'home', label: 'Home', url: '/'},
      {_key: 'writings', label: 'Writings', url: '/writings/poems', children: [
        {_key: 'poetry', label: 'Poetry', url: '/writings/poems'},
        {_key: 'stories', label: 'Stories', url: '/writings/stories'},
        {_key: 'memoirs', label: 'Memoirs', url: '/writings/memoirs'},
        {_key: 'others', label: 'Others', url: '/writings/others'},
      ]},
      {_key: 'videos', label: 'Videos', url: '/videos/poetry-performances', children: [
        {_key: 'performances', label: 'Poetry & Performances', url: '/videos/poetry-performances'},
        {_key: 'podcasts', label: 'Podcasts & Interviews', url: '/videos/podcasts'},
        {_key: 'documentaries', label: 'Documentaries', url: '/videos/documentaries'},
        {_key: 'youtube', label: 'YouTube Channel', url: '/videos/youtube-channel'},
      ]},
      {_key: 'work', label: 'Work & collaboration', url: '/work-and-collaboration'},
      {_key: 'media', label: 'Media features', url: '/media-features'},
      {_key: 'experience', label: 'Experience', url: '/experience'},
      {_key: 'awards', label: 'Awards', url: '/awards'},
    ],
    socialLinks: [
      {_key: 'instagram', label: 'Instagram', url: '#'},
      {_key: 'facebook', label: 'Facebook', url: '#'},
      {_key: 'twitter', label: 'X / Twitter', url: '#'},
    ],
  },
  groups: [
    {name: 'identity', title: 'Site identity'},
    {name: 'header', title: 'Header'},
    {name: 'footer', title: 'Footer'},
  ],
  fields: [
    defineField({name: 'siteName', title: 'Site name', type: 'string', group: 'identity', validation: (rule) => rule.required()}),
    defineField({name: 'shortName', title: 'Logo initials', type: 'string', group: 'identity', validation: (rule) => rule.required().max(4)}),
    defineField({name: 'roleLabel', title: 'Role below the name', type: 'string', group: 'identity', validation: (rule) => rule.required()}),
    defineField({name: 'email', title: 'Contact email', type: 'email', group: 'identity', validation: (rule) => rule.required()}),
    defineField({
      name: 'navigation',
      title: 'Navigation',
      type: 'array',
      group: 'header',
      validation: (rule) => rule.required().min(1),
      of: [defineArrayMember({
        name: 'navigationItem',
        title: 'Navigation item',
        type: 'object',
        fields: [
          ...linkFields,
          defineField({
            name: 'children',
            title: 'Dropdown links (optional)',
            type: 'array',
            of: [defineArrayMember({name: 'navigationChild', title: 'Dropdown link', type: 'object', fields: linkFields})],
          }),
        ],
        preview: {select: {title: 'label', subtitle: 'url'}},
      })],
    }),
    defineField({name: 'contactButtonLabel', title: 'Contact button label', type: 'string', group: 'header', validation: (rule) => rule.required()}),
    defineField({name: 'footerPrompt', title: 'Footer prompt', type: 'string', group: 'footer', validation: (rule) => rule.required()}),
    defineField({name: 'socialHeading', title: 'Social links heading', type: 'string', group: 'footer', validation: (rule) => rule.required()}),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      group: 'footer',
      of: [defineArrayMember({name: 'socialLink', title: 'Social link', type: 'object', fields: linkFields})],
    }),
    defineField({name: 'copyrightName', title: 'Copyright name', type: 'string', group: 'footer', validation: (rule) => rule.required()}),
    defineField({name: 'backToTopLabel', title: 'Back-to-top label', type: 'string', group: 'footer', validation: (rule) => rule.required()}),
  ],
  preview: {prepare: () => ({title: 'Header & Footer'})},
})
