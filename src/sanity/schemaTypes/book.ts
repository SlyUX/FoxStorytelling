import { defineType, defineField } from 'sanity'

import { CLOUD_COLOR_OPTIONS } from './objects'
import { slugField } from './slugField'
export default defineType({
  // Shown as "Story" in the Studio; the type keeps its name, `book`, so saved stories stay put.
  name: 'book', title: 'Story', type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    slugField('title', '/stories/scar-tissue-bargains'),
    defineField({ name: 'series', type: 'string', description: 'e.g. Scar Tissue' }),
    defineField({ name: 'cover', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'showOnHome',
      title: 'Show on the home page',
      type: 'boolean',
      initialValue: false,
      description: 'Rotates through the home page’s first screen, one story per breath, in your Stories order. Needs home page art.',
      validation: (r) =>
        r
          .custom((value, context) =>
            value && !(context.document as { homeArt?: { asset?: unknown } } | undefined)?.homeArt?.asset
              ? 'Add home page art below, or this book won’t show on the home page.'
              : true,
          )
          .warning(),
    }),
    defineField({
      name: 'homeArt',
      title: 'Home page art',
      type: 'imageWithAlt',
      description:
        'Fills half the home page’s first screen while this book is showing, and slowly breathes. Tall art on black, at least 2000px tall. Set the hotspot on the part that must stay in view.',
      hidden: ({ document }) => !document?.showOnHome,
    }),
    defineField({
      name: 'showCloud',
      title: 'Cloud',
      type: 'boolean',
      initialValue: true,
      description: 'Roll the dark cloud over this book’s home page art. Turn it off for art that’s better left clear.',
      hidden: ({ document }) => !document?.showOnHome,
    }),
    defineField({
      name: 'cloudColor',
      title: 'Cloud color',
      type: 'color',
      options: CLOUD_COLOR_OPTIONS,
      description:
        'The cloud that rolls over this book’s home page art. Keep it very dark: it should be felt more than seen. Leave blank to use the cloud color in Site settings.',
      hidden: ({ document }) => !document?.showOnHome || document?.showCloud === false,
    }),
    defineField({ name: 'status', type: 'string', description: 'Available only when there’s somewhere to buy it (Buy links).',
      options: { list: ['Available', 'Upcoming', 'On Kickstarter', 'In development'] }, initialValue: 'Available' }),
    defineField({
      name: 'format',
      type: 'string',
      description: 'What kind of book it is, shown as a small label beside its status, so readers know what they’d be buying.',
      options: { list: ['Novel', 'Novella', 'Short stories', 'Comic', 'Graphic novel', 'Art book', 'Series proposal'] },
    }),
    defineField({ name: 'shortDescription', type: 'text', rows: 3 }),
    defineField({ name: 'description', type: 'richText' }),
    defineField({ name: 'buyLinks', title: 'Buy links', type: 'array', of: [{ type: 'buyLink' }] }),
    defineField({ name: 'publishDate', type: 'date' }),
    defineField({ name: 'isbn', title: 'ISBN', type: 'string',
      description: 'The print ISBN-13, with or without hyphens. For search engines; not shown on the page.',
      validation: (r) => r.custom((v?: string) => !v || /^97[89]\d{10}$/.test(v.replace(/[-\s]/g, '')) ? true : 'An ISBN-13: 13 digits starting 978 or 979.') }),
    defineField({ name: 'order', type: 'number' }),
  ],
  orderings: [{ title: 'Custom order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'series', media: 'cover' } },
})
