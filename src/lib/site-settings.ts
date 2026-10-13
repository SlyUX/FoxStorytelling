import { cache } from 'react'

import { safeFetch, SITE_SETTINGS_QUERY } from '@/lib/queries'
import type { SITE_SETTINGS_QUERY_RESULT } from '../../sanity.types'

type Settings = NonNullable<SITE_SETTINGS_QUERY_RESULT>

/**
 * Site-wide copy from the `siteSettings` singleton, merged over defaults.
 *
 * The defaults exist so the site renders before the singleton is filled in,
 * and survives a cleared field. They are DEFAULTS, not content: every one has
 * a matching field in `schemaTypes/siteSettings.ts`, and Sanity overrides it.
 * Do not add a string here without that field.
 */
const DEFAULTS = {
  title: 'Fox Storytelling',
  tagline: 'Redemptive horror.',
  seoDescription: 'Redemptive horror — dark stories with a soul.',
  viewAllLabel: 'See all',
  navigation: [
    { _key: 'books', _type: 'link', label: 'Books', href: '/books' },
    { _key: 'blog', _type: 'link', label: 'Rejection Files', href: '/blog' },
    { _key: 'about', _type: 'link', label: 'About', href: '/about' },
  ],
  homeIntro: 'Dark stories with a soul — books and comics by Stephen Fox.',
  featuredLabel: 'Featured',
  homePostsHeading: 'Latest from the Rejection Files',
  booksTitle: 'Books',
  booksEmpty: 'New books are on the way.',
  buyLabel: 'Buy on {store}',
  blogTitle: 'The Rejection Files',
  postsEmpty: 'The first post is on its way.',
  newsletterHeading: 'Join the list',
  newsletterBlurb: 'Get the free reader magnet and news on new books.',
  newsletterButtonLabel: 'Join the list',
} satisfies Partial<Settings>

export type SiteSettings = Omit<Settings, keyof typeof DEFAULTS> & typeof DEFAULTS

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const fetched = await safeFetch<SITE_SETTINGS_QUERY_RESULT>(SITE_SETTINGS_QUERY, {}, null)
  const merged: Record<string, unknown> = { ...DEFAULTS }
  // Only non-empty values override a default: a cleared field falls back.
  for (const [key, value] of Object.entries(fetched ?? {})) {
    const empty = value === null || value === '' || (Array.isArray(value) && value.length === 0)
    if (!empty) merged[key] = value
  }
  return merged as SiteSettings
})
