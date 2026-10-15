import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * Small reusable types. Registered in `index.ts` so any document can use them
 * by name.
 */

/**
 * The color of the cloud that rolls over the home page art (a `color` field
 * from @sanity/color-input). Presets: black, and the dark red it first was.
 * Not a registered type: a shared field options object.
 */
export const CLOUD_COLOR_OPTIONS = { disableAlpha: true, colorList: ['#000000', '#3a060a'] }

/** A labeled link. Internal paths ("/stories") or full URLs both work. */
export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required() }),
    defineField({
      name: 'href',
      title: 'Address',
      type: 'string',
      description: 'A site path like "/stories", or a full URL like "https://bookshop.org/…".',
      validation: (rule) =>
        rule
          .required()
          .custom((value) => (typeof value === 'string' && /^(\/|https?:|mailto:)/.test(value) ? true : 'Start with "/", "https://", or "mailto:".')),
    }),
  ],
  preview: { select: { title: 'label', subtitle: 'href' } },
})

/** Every image on the site uses this instead of the bare `image` type, so alt text is always available. */
export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description:
        'Describe what the image shows and why it matters, in one sentence; it is read aloud. Leave blank for a cover that sits right beside its own title, so a screen reader doesn’t announce it twice.',
      validation: (rule) => rule.max(160).warning('Long alt text is hard to listen to. Aim for one sentence.'),
    }),
    defineField({ name: 'caption', title: 'Caption', type: 'string', description: 'Optional. Shown under the image.' }),
    // Only in body text (an image inside an array, like a post's Body), where there's text to sit beside.
    defineField({
      name: 'placement',
      title: 'Placement',
      type: 'string',
      options: {
        list: [
          { title: 'In the column', value: 'column' },
          { title: 'Beside the text', value: 'beside' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'column',
      description: 'Beside the text: the image sits to the right of the paragraphs that follow it (above them on phones), up to 416px tall. For character designs and other tall, narrow art.',
      hidden: ({ path }) => !(path.length > 2 && typeof path[1] === 'object'),
    }),
  ],
})

/**
 * Long-form body copy for books, posts, and pages. Deliberately small: every
 * style here needs a matching renderer in `src/components/rich-text.tsx`, and
 * the styleguide shows each one.
 */
export const richText = defineType({
  name: 'richText',
  title: 'Body',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Heading', value: 'h2' },
        { title: 'Subheading', value: 'h3' },
        { title: 'Quote', value: 'blockquote' },
      ],
      marks: {
        annotations: [
          defineArrayMember({
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              defineField({
                name: 'href',
                type: 'url',
                title: 'URL',
                description: 'A page on this site ("/stories/monster"), or a full address. Pages on this site open in place; other sites, in a new tab.',
                validation: (rule) => rule.uri({ scheme: ['http', 'https', 'mailto'], allowRelative: true }),
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({ type: 'imageWithAlt' }),
  ],
})
