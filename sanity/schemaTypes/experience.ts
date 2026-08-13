import {TimelineIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const experience = defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  icon: TimelineIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Role title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'organization',
      title: 'Organization',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'period',
      title: 'Period',
      type: 'string',
      description: 'For example: Mar 2023 — Sep 2023 or 2023 — Present',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location or work arrangement',
      type: 'string',
      description: 'For example: Kathmandu, Nepal · On-site or Hybrid',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Role summary',
      type: 'text',
      rows: 4,
      description: 'Each new paragraph or line is displayed as a separate bullet point.',
      validation: (rule) => rule.required().max(700),
    }),
    defineField({
      name: 'highlights',
      title: 'Areas of work',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.required().min(1).max(6).unique(),
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers appear first in the timeline.',
      initialValue: 100,
      validation: (rule) => rule.required().integer().min(0),
    }),
  ],
  orderings: [
    {
      title: 'Timeline order',
      name: 'displayOrderAsc',
      by: [{field: 'displayOrder', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      organization: 'organization',
      period: 'period',
    },
    prepare({title, organization, period}) {
      return {
        title,
        subtitle: [organization, period].filter(Boolean).join(' · '),
      }
    },
  },
})
