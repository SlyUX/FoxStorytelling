import { defineType, defineField } from 'sanity'
export default defineType({
  name: 'page', title: 'Page', type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, description: 'The address: /about for a slug of "about".', validation: (r) => r.required() }),
    defineField({ name: 'intro', type: 'text', rows: 2, description: 'Under the title, in the muted gray.' }),
    defineField({ name: 'body', type: 'richText' }),
  ],
})
