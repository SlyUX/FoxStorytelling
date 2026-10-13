import { defineArrayMember, defineField, defineType } from 'sanity'

import { CLOUD_COLOR_OPTIONS } from './objects'

/**
 * Every reader-facing string that isn't part of a book, post, or page. A
 * singleton pinned to the ID `siteSettings` (see `src/sanity/structure.ts`).
 * Each field has a default in `src/lib/site-settings.ts`, so a blank field
 * falls back rather than leaving a hole.
 */
export default defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'nav', title: 'Navigation' },
    { name: 'home', title: 'Home page' },
    { name: 'books', title: 'Books' },
    { name: 'blog', title: 'Rejection Files' },
    { name: 'newsletter', title: 'Newsletter' },
  ],
  fields: [
    // General
    defineField({ name: 'title', title: 'Site title', type: 'string', group: 'general', description: 'Browser tab title, and the logo’s alt text.' }),
    defineField({ name: 'tagline', type: 'string', group: 'general', description: 'The home page’s headline, e.g. "Redemptive horror."' }),
    defineField({
      name: 'seoDescription',
      title: 'Site description',
      type: 'text',
      rows: 2,
      group: 'general',
      description: 'For search engines and link previews.',
      validation: (rule) => rule.max(160).warning('Search engines cut off around 160 characters.'),
    }),
    defineField({ name: 'viewAllLabel', title: '"See all" link text', type: 'string', group: 'general', description: 'Beside section headings that preview a longer list.' }),
    defineField({ name: 'socials', title: 'Social links', type: 'array', group: 'general', of: [{ type: 'buyLink' }] }),

    // Navigation
    defineField({
      name: 'navigation',
      title: 'Navigation',
      type: 'array',
      group: 'nav',
      description: 'The pages in the header, in order. The logo links home.',
      of: [defineArrayMember({ type: 'link' })],
      validation: (rule) => rule.max(6),
    }),

    // Home page
    defineField({
      name: 'homeImage',
      title: 'Art',
      type: 'imageWithAlt',
      group: 'home',
      description:
        'Fills the left half of the first screen (the top half on phones) when no book is set to show on the home page (Books → Show on the home page), and slowly breathes. Tall art on black works best. Set the hotspot on the part that must stay in view.',
    }),
    defineField({
      name: 'cloudColor',
      title: 'Cloud color',
      type: 'color',
      group: 'home',
      options: CLOUD_COLOR_OPTIONS,
      description: 'The cloud that rolls over the home page art. Books can pick their own. Keep it very dark: it should be felt more than seen. Leave blank for black.',
    }),
    defineField({ name: 'homeIntro', title: 'Intro', type: 'text', rows: 2, group: 'home', description: 'Under the headline.' }),
    defineField({ name: 'featuredBookLabel', title: 'Featured book label', type: 'string', group: 'home', description: 'Small capitals above the book on the first screen.' }),
    defineField({ name: 'bookDetailsLabel', title: '"About the book" link text', type: 'string', group: 'home', description: 'Beside the buy buttons, linking to the book’s page.' }),
    defineField({
      name: 'featuredLabel',
      title: 'Featured post label',
      type: 'string',
      group: 'home',
      description: 'Marks posts set as Featured, which lead the home page’s list of posts.',
    }),
    defineField({ name: 'allBooksLabel', title: '"All books" link text', type: 'string', group: 'home', description: 'Beside the featured book; glides down to the Books section.' }),
    defineField({ name: 'aboutLabel', title: 'About preview heading', type: 'string', group: 'home', description: 'Small capitals above the About preview.' }),
    defineField({
      name: 'aboutPreview',
      title: 'About preview',
      type: 'text',
      rows: 3,
      group: 'home',
      description: 'A sentence or two on the home page’s first screen, below the featured book. The default is placeholder copy: replace it.',
    }),
    defineField({ name: 'aboutLinkLabel', title: 'About link text', type: 'string', group: 'home', description: 'Shown once there’s an About page (slug "about").' }),
    defineField({ name: 'allPostsLabel', title: '"All posts" link text', type: 'string', group: 'home', description: 'Beside the Rejection Files previews.' }),

    // Books
    defineField({ name: 'booksTitle', title: 'Books page title', type: 'string', group: 'books' }),
    defineField({ name: 'booksIntro', title: 'Books page intro', type: 'text', rows: 2, group: 'books' }),
    defineField({ name: 'booksEmpty', title: 'No books yet', type: 'string', group: 'books', description: 'Shown where books would be, before there are any.' }),
    defineField({ name: 'buyLabel', title: 'Buy button text', type: 'string', group: 'books', description: '{store} becomes the store’s name, e.g. "Buy on {store}".' }),

    // Rejection Files
    defineField({ name: 'blogTitle', title: 'Blog title', type: 'string', group: 'blog' }),
    defineField({ name: 'blogIntro', title: 'Blog intro', type: 'text', rows: 2, group: 'blog' }),
    defineField({ name: 'postsEmpty', title: 'No posts yet', type: 'string', group: 'blog' }),

    // Newsletter
    defineField({ name: 'newsletterHeading', title: 'Heading', type: 'string', group: 'newsletter' }),
    defineField({ name: 'newsletterBlurb', title: 'Blurb', type: 'text', rows: 2, group: 'newsletter' }),
    defineField({
      name: 'newsletterUrl',
      title: 'Sign-up form address',
      type: 'url',
      group: 'newsletter',
      description: 'The MailerLite hosted form. The site never collects emails itself; until this is set, the sign-up panel stays hidden.',
    }),
    defineField({ name: 'newsletterButtonLabel', title: 'Button text', type: 'string', group: 'newsletter' }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
})
