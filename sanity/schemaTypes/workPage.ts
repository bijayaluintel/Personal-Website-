import {DocumentIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const workPage = defineType({
  name: 'workPage',
  title: 'Work & Collaboration Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({name: 'heroEyebrow', title: 'Hero eyebrow', type: 'string', initialValue: 'Work & collaboration', validation: (rule) => rule.required()}),
    defineField({name: 'heroTitle', title: 'Page title', type: 'string', initialValue: 'Work & Collaboration', validation: (rule) => rule.required()}),
    defineField({name: 'servicesEyebrow', title: 'Services eyebrow', type: 'string', initialValue: 'What I do', validation: (rule) => rule.required()}),
    defineField({name: 'collaborationEyebrow', title: 'Collaboration eyebrow', type: 'string', initialValue: 'Have a project in mind?', validation: (rule) => rule.required()}),
    defineField({name: 'collaborationTitle', title: 'Collaboration title', type: 'string', initialValue: 'Let’s make something that stays with people.', validation: (rule) => rule.required()}),
    defineField({
      name: 'collaborationDescription',
      title: 'Collaboration description',
      type: 'text',
      rows: 3,
      initialValue: 'For commissions, script development, song lyrics, translation projects, or thoughtful brand collaborations, share a little about what you are building.',
      validation: (rule) => rule.required().max(400),
    }),
  ],
  preview: {prepare: () => ({title: 'Work & Collaboration Page'})},
})
