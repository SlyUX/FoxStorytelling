import { defineType, defineField } from 'sanity'

import { slugField } from './slugField'
export default defineType({
  name: 'page', title: 'Page', type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    slugField('title', '/about'),
    defineField({ name: 'intro', type: 'text', rows: 2, description: 'Under the title, in the muted gray.' }),
    defineField({ name: 'body', type: 'richText' }),
  ],
})
