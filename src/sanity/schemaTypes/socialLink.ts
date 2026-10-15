import { defineType, defineField } from 'sanity'

/**
 * The platforms the header has marks for (see SocialLinks); a new one needs its
 * mark there too. ND Riot isn't a social network, but its lockup sits with them.
 */
export const SOCIAL_PLATFORMS = ['ND Riot', 'Instagram', 'Facebook', 'YouTube', 'Bluesky'] as const

export default defineType({
  name: 'socialLink', title: 'Social link', type: 'object',
  fields: [
    defineField({ name: 'platform', title: 'Platform', type: 'string',
      options: { list: [...SOCIAL_PLATFORMS] }, validation: (r) => r.required() }),
    defineField({ name: 'url', title: 'URL', type: 'url', description: 'The profile or channel page (for ND Riot, its site).',
      validation: (r) => r.required().uri({ scheme: ['https'] }) }),
  ],
  preview: { select: { title: 'platform', subtitle: 'url' } },
})
