import { defineType, defineField } from 'sanity'
export default defineType({
  name: 'post', title: 'Post', type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'category', type: 'string',
      options: { list: ['Rejection Files', 'News', 'Craft'] }, initialValue: 'Rejection Files' }),
    defineField({ name: 'excerpt', type: 'text', rows: 3 }),
    defineField({ name: 'cover', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'body', type: 'array', of: [{ type: 'block' }, { type: 'image' }] }),
    defineField({ name: 'publishedAt', type: 'datetime', validation: (r) => r.required() }),
    defineField({ name: 'featured', type: 'boolean', initialValue: false }),
  ],
  orderings: [{ title: 'Newest', name: 'new', by: [{ field: 'publishedAt', direction: 'desc' }] }],
  preview: { select: { title: 'title', subtitle: 'category', media: 'cover' } },
})
