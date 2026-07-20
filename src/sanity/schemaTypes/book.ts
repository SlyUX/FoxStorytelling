import { defineType, defineField } from 'sanity'
export default defineType({
  name: 'book', title: 'Book', type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'series', type: 'string', description: 'e.g. Scar Tissue' }),
    defineField({ name: 'cover', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'status', type: 'string',
      options: { list: ['Available', 'Upcoming', 'On Kickstarter'] }, initialValue: 'Available' }),
    defineField({ name: 'shortDescription', type: 'text', rows: 3 }),
    defineField({ name: 'description', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'buyLinks', title: 'Buy links', type: 'array', of: [{ type: 'buyLink' }] }),
    defineField({ name: 'publishDate', type: 'date' }),
    defineField({ name: 'order', type: 'number' }),
  ],
  orderings: [{ title: 'Custom order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'series', media: 'cover' } },
})
