import { EnvelopeIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const newsletterIssue = defineType({
  name: 'newsletterIssue',
  title: 'Newsletter Issue',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'subject',
      title: 'Email subject',
      type: 'string',
      description:
        'Create one Kit draft from this issue. Review and send it in Kit. Changes made here afterward do not update that draft.',
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: 'introduction',
      title: 'Introduction (optional)',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'articles',
      title: 'Selected articles',
      type: 'array',
      description:
        'Choose one or more published poems or articles. Drag them into the order you want in the email.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'writing' }],
          options: {
            disableNew: true,
            filter:
              '!(_id in path("drafts.**")) && !(_id in path("versions.**")) && defined(slug.current) && defined(excerpt)',
          },
        }),
      ],
      validation: (rule) => rule.required().min(1).unique(),
    }),
  ],
  preview: {
    select: { title: 'subject' },
    prepare: ({ title }) => ({ title, subtitle: 'Review and send in Kit' }),
  },
})
