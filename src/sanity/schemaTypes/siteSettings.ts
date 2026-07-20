import { defineType, defineField } from 'sanity'
export default defineType({
  name: 'siteSettings', title: 'Site settings', type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'tagline', type: 'string', description: 'e.g. Redemptive horror.' }),
    defineField({ name: 'socials', title: 'Social links', type: 'array', of: [{ type: 'buyLink' }] }),
    defineField({ name: 'newsletterBlurb', type: 'text', rows: 2 }),
    defineField({ name: 'seoDescription', type: 'text', rows: 2 }),
  ],
})
