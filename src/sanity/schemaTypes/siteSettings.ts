import { defineArrayMember, defineField, defineType } from 'sanity'

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
    defineField({ name: 'homeIntro', title: 'Intro', type: 'text', rows: 2, group: 'home', description: 'Under the headline.' }),
    defineField({ name: 'featuredLabel', title: 'Featured post label', type: 'string', group: 'home' }),
    defineField({ name: 'homePostsHeading', title: 'Latest posts heading', type: 'string', group: 'home' }),

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
