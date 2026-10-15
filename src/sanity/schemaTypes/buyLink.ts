import { defineType, defineField } from 'sanity'

const OTHER = 'Other'

export default defineType({
  name: 'buyLink', title: 'Buy link', type: 'object',
  fields: [
    defineField({ name: 'store', title: 'Store', type: 'string',
      options: { list: ['Bookshop.org', 'Amazon', 'Kickstarter', { title: 'Another store', value: OTHER }] },
      validation: (r) => r.required() }),
    defineField({ name: 'storeName', title: 'Store name', type: 'string',
      description: 'As it reads on the button, after "Buy on": IngramSpark, Barnes & Noble.',
      hidden: ({ parent }) => parent?.store !== OTHER,
      validation: (r) => r.custom((value, { parent }) => ((parent as { store?: string } | undefined)?.store === OTHER && !value?.trim() ? 'Name the store.' : true)) }),
    defineField({ name: 'url', title: 'URL', type: 'url', validation: (r) => r.required() }),
  ],
  preview: {
    select: { store: 'store', storeName: 'storeName', url: 'url' },
    prepare: ({ store, storeName, url }) => ({ title: store === OTHER ? storeName || 'Another store' : store, subtitle: url }),
  },
})
