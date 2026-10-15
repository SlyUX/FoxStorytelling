import { defineType, defineField } from 'sanity'

import { slugField } from './slugField'

/** How a series' posts are set (see the post page): its form, not its subject. */
export const SERIES_FORMS = [
  { title: 'Prose', value: 'prose' },
  { title: 'Poetry', value: 'poetry' },
  { title: 'Comics', value: 'comics' },
]

/**
 * A Short Form series: The Rejection Files, Poetry, Mere Christian, and any
 * added later. Each has a page at /short-form/[slug], its posts beneath it.
 */
export default defineType({
  name: 'series', title: 'Series', type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    slugField('title', '/short-form/your-series'),
    defineField({ name: 'intro', type: 'text', rows: 2, description: 'Under the title on its page, and beside it on the Short Form page.' }),
    defineField({ name: 'form', type: 'string', initialValue: 'prose', validation: (r) => r.required(),
      options: { list: SERIES_FORMS, layout: 'radio' },
      description: 'How its posts are set. Prose: at reading width. Poetry: every line break kept, and no excerpts on cards. Comics: images run wide.' }),
    defineField({ name: 'order', type: 'number', description: 'Its place on the Short Form page, lowest first.' }),
  ],
  orderings: [{ title: 'Custom order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'form' } },
})
