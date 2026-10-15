import { defineType, defineField } from 'sanity'

import { slugField } from './slugField'
export default defineType({
  name: 'post', title: 'Post', type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    slugField('title', '/short-form/the-series/your-post-title'),
    defineField({ name: 'series', type: 'reference', to: [{ type: 'series' }], validation: (r) => r.required(),
      description: 'Where it lives in Short Form, and how it’s set (the series’ form).' }),
    // Retired: the series replaced it. Hidden until it's cleared from saved posts, then delete this field.
    defineField({ name: 'category', type: 'string', hidden: true }),
    defineField({ name: 'excerpt', type: 'text', rows: 3 }),
    defineField({ name: 'cover', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'body', type: 'richText' }),
    defineField({ name: 'publishedAt', type: 'datetime', validation: (r) => r.required() }),
    defineField({ name: 'featured', type: 'boolean', initialValue: false }),
  ],
  orderings: [{ title: 'Newest', name: 'new', by: [{ field: 'publishedAt', direction: 'desc' }] }],
  preview: { select: { title: 'title', subtitle: 'series.title', media: 'cover' } },
})
