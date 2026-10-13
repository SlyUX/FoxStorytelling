import { defineType, defineField } from 'sanity'

import { CLOUD_COLOR_OPTIONS } from './objects'
export default defineType({
  name: 'book', title: 'Book', type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'series', type: 'string', description: 'e.g. Scar Tissue' }),
    defineField({ name: 'cover', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'showOnHome',
      title: 'Show on the home page',
      type: 'boolean',
      initialValue: false,
      description: 'Rotates through the home page’s first screen, one book per breath, in your Books order. Needs home page art.',
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
      name: 'cloudColor',
      title: 'Cloud color',
      type: 'color',
      options: CLOUD_COLOR_OPTIONS,
      description:
        'The cloud that rolls over this book’s home page art. Keep it very dark: it should be felt more than seen. Leave blank to use the cloud color in Site settings.',
      hidden: ({ document }) => !document?.showOnHome,
    }),
    defineField({ name: 'status', type: 'string',
      options: { list: ['Available', 'Upcoming', 'On Kickstarter'] }, initialValue: 'Available' }),
    defineField({ name: 'shortDescription', type: 'text', rows: 3 }),
    defineField({ name: 'description', type: 'richText' }),
    defineField({ name: 'buyLinks', title: 'Buy links', type: 'array', of: [{ type: 'buyLink' }] }),
    defineField({ name: 'publishDate', type: 'date' }),
    defineField({ name: 'order', type: 'number' }),
  ],
  orderings: [{ title: 'Custom order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'series', media: 'cover' } },
})
