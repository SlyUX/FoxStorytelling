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
    { name: 'books', title: 'Stories' },
    { name: 'shortForm', title: 'Short Form' },
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
    defineField({ name: 'socials', title: 'Social links', type: 'array', group: 'general', description: 'Marks in the header (at its right edge on desktops, in the menu on phones), in this order.', of: [{ type: 'socialLink' }] }),

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
        'Fills the left half of the first screen (the top half on phones) when no book is set to show on the home page (Stories → Show on the home page), and slowly breathes. Tall art on black works best. Set the hotspot on the part that must stay in view.',
    }),
    defineField({
      name: 'cloudColor',
      title: 'Cloud color',
      type: 'color',
      group: 'home',
      options: CLOUD_COLOR_OPTIONS,
      description: 'The cloud that rolls over the home page art. Stories can pick their own. Keep it very dark: it should be felt more than seen. Leave blank for black.',
    }),
    defineField({ name: 'homeIntro', title: 'Intro', type: 'text', rows: 2, group: 'home', description: 'Under the headline.' }),
    defineField({
      name: 'authorPhoto',
      title: 'Author photo',
      type: 'imageWithAlt',
      group: 'home',
      description:
        'A portrait, shown in a circle to the left of the intro. Set the hotspot on your face. Leave the alt text blank: the intro beside it already names you.',
    }),
    defineField({
      name: 'featuredStoriesLabel',
      title: 'Featured Stories label',
      type: 'string',
      group: 'home',
      description: 'Names the rotating books: shown above them on phones, and read to screen readers everywhere.',
    }),
    defineField({ name: 'bookDetailsLabel', title: '"About the book" link text', type: 'string', group: 'home', description: 'Beside the buy buttons, linking to the book’s page.' }),
    defineField({
      name: 'featuredLabel',
      title: 'Featured post label',
      type: 'string',
      group: 'home',
      description: 'Marks posts set as Featured, which lead the home page’s list of posts.',
    }),
    defineField({ name: 'bioLabel', title: 'Bio button text', type: 'string', group: 'home', description: 'Under the description; opens the About page (slug "about"), and shows once that page exists.' }),
    defineField({ name: 'allBooksLabel', title: '"All stories" button text', type: 'string', group: 'home', description: 'Under the description; opens the Stories page.' }),
    defineField({
      name: 'homeSeries',
      title: 'Featured series',
      type: 'reference',
      to: [{ type: 'series' }],
      group: 'home',
      description: 'Its posts show beside the books, featured posts first. Without one, the newest posts from every series show.',
    }),
    defineField({ name: 'allPostsLabel', title: '"All posts" link text', type: 'string', group: 'home', description: 'Beside the featured series’ previews; opens its page.' }),

    // Stories (the fields keep their `books` names, so saved values stay put)
    defineField({ name: 'booksTitle', title: 'Stories page title', type: 'string', group: 'books' }),
    defineField({ name: 'booksIntro', title: 'Stories page intro', type: 'text', rows: 2, group: 'books', description: 'Also the page’s description for search engines: worth saying “books”. The default is placeholder copy.' }),
    defineField({ name: 'booksEmpty', title: 'No books yet', type: 'string', group: 'books', description: 'Shown where books would be, before there are any.' }),
    defineField({ name: 'buyLabel', title: 'Buy button text', type: 'string', group: 'books', description: '{store} becomes the store’s name, e.g. "Buy on {store}".' }),

    // Short Form (each series has its own title and intro, on its document)
    defineField({ name: 'shortFormTitle', title: 'Short Form page title', type: 'string', group: 'shortForm' }),
    defineField({ name: 'shortFormIntro', title: 'Short Form page intro', type: 'text', rows: 2, group: 'shortForm', description: 'Also the page’s description for search engines. The default is placeholder copy.' }),
    defineField({ name: 'postsEmpty', title: 'No posts yet', type: 'string', group: 'shortForm', description: 'Shown where posts would be, before there are any.' }),

    // Newsletter
    defineField({ name: 'newsletterHeading', title: 'Heading', type: 'string', group: 'newsletter' }),
    defineField({ name: 'newsletterBlurb', title: 'Blurb', type: 'text', rows: 2, group: 'newsletter' }),
    defineField({
      name: 'newsletterForm',
      title: 'MailerLite form address',
      type: 'url',
      group: 'newsletter',
      description:
        'Where the sign-up sends the address, straight from the reader’s browser: the site never sees it. In MailerLite: Forms → the form → Embed form → HTML code, the address after action=. Until this is set, the sign-up stays hidden.',
      validation: (rule) =>
        rule.custom((value?: string) =>
          !value || /^https:\/\/assets\.mailerlite\.com\/jsonp\/\d+\/forms\/\d+\/subscribe$/.test(value) ? true : 'Use the form’s address from its HTML code: https://assets.mailerlite.com/jsonp/…/forms/…/subscribe',
        ),
    }),
    defineField({ name: 'newsletterEmailLabel', title: 'Email field label', type: 'string', group: 'newsletter', description: 'Shown in the empty field, and read to screen readers as its name.' }),
    defineField({ name: 'newsletterButtonLabel', title: 'Button text', type: 'string', group: 'newsletter' }),
    defineField({ name: 'newsletterSuccess', title: 'Thank-you message', type: 'text', rows: 2, group: 'newsletter', description: 'Replaces the form once MailerLite has the address.' }),
    defineField({ name: 'newsletterError', title: 'Error message', type: 'string', group: 'newsletter', description: 'When MailerLite turns the address away, or can’t be reached.' }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
})
