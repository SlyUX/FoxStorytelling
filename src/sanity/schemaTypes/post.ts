import { defineType, defineField } from 'sanity'

import { slugField } from './slugField'
export default defineType({
  name: 'post', title: 'Post', type: 'document',
  fieldsets: [{ name: 'rejectionFile', title: 'The Rejection File',
    description: 'For posts in The Rejection Files: the Body tells the story (making it, sending it out, the rejections); these hold the rest. Leave them empty for other posts.',
    options: { collapsible: true, collapsed: false } }],
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    slugField('title', '/short-form/the-series/your-post-title'),
    defineField({ name: 'series', type: 'reference', to: [{ type: 'series' }], validation: (r) => r.required(),
      description: 'Where it lives in Short Form, and how it’s set (the series’ form).' }),
    defineField({ name: 'excerpt', type: 'text', rows: 3 }),
    defineField({ name: 'cover', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'body', title: 'Body', type: 'richText',
      description: 'The post. For a Rejection File: the story of making it, submitting it, and getting rejected.' }),
    defineField({ name: 'became', title: 'What it became', type: 'object', fieldset: 'rejectionFile',
      description: 'After the story: link the story it became, say what happened in your words, or both.',
      fields: [
        defineField({ name: 'story', title: 'A story on this site', type: 'reference', to: [{ type: 'book' }],
          description: 'Its cover, title, and blurb show, linking to its page.' }),
        defineField({ name: 'note', title: 'In your words', type: 'text', rows: 4, description: 'A blank line starts a new paragraph.' }),
      ] }),
    defineField({ name: 'pitch', title: 'The pitch', type: 'richText', fieldset: 'rejectionFile',
      description: 'The pitch itself, as it went out: the deck, bible, or query letter. Shown after the story, as a document of its own.' }),
    defineField({ name: 'script', title: 'The script', type: 'screenplay', fieldset: 'rejectionFile',
      description: 'A script that went out with the pitch, set as a script: pick each paragraph’s style (Scene heading, Action, Character, Parenthetical, Dialogue, Transition). Usually a part of its own.' }),
    defineField({ name: 'follows', title: 'Follows', type: 'reference', to: [{ type: 'post' }], fieldset: 'rejectionFile',
      description: 'For a Rejection File in parts: the part this one continues. Each links to the other.' }),
    defineField({ name: 'publishedAt', type: 'datetime', validation: (r) => r.required() }),
    defineField({ name: 'featured', type: 'boolean', initialValue: false }),
  ],
  orderings: [{ title: 'Newest', name: 'new', by: [{ field: 'publishedAt', direction: 'desc' }] }],
  preview: { select: { title: 'title', subtitle: 'series.title', media: 'cover' } },
})
