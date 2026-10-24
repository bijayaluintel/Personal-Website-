import { defineField, defineType } from 'sanity'

export const newsletterDelivery = defineType({
  name: 'newsletterDelivery',
  title: 'Newsletter Delivery',
  type: 'document',
  readOnly: true,
  fields: [
    defineField({ name: 'title', title: 'Writing title', type: 'string' }),
    defineField({
      name: 'writing',
      title: 'Writing',
      type: 'reference',
      to: [{ type: 'writing' }],
      weak: true,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Processing', value: 'processing' },
          { title: 'Draft in Kit', value: 'draft' },
          { title: 'Scheduled in Kit', value: 'scheduled' },
          { title: 'Kit rejected the request', value: 'failed' },
          { title: 'Check Kit before retrying', value: 'needsReview' },
        ],
      },
    }),
    defineField({
      name: 'broadcastId',
      title: 'Kit broadcast ID',
      type: 'number',
    }),
    defineField({ name: 'sendAt', title: 'Scheduled time', type: 'datetime' }),
    defineField({ name: 'error', title: 'Last error', type: 'text' }),
  ],
  preview: { select: { title: 'title', subtitle: 'status' } },
})
