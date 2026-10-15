import { defineQuery } from 'next-sanity'

import { client } from '@/sanity/client'

/**
 * Every fetch goes through here with an explicit fallback. GROQ returns `null`
 * (not `[]`) when nothing matches, and a missing project or network error
 * should render an empty state rather than a 500.
 */
export async function safeFetch<T>(query: string, params: Record<string, unknown>, fallback: T): Promise<T> {
  try {
    const result = await client.fetch<T>(query, params)
    return result ?? fallback
  } catch {
    return fallback
  }
}

const BOOK_CARD = `_id,title,"slug":slug.current,series,status,format,shortDescription,cover,buyLinks`
/** A post's series, for its address, its label, and how it's set. Posts without one (or a series without a slug) are left out of every list. */
const POST_SERIES = `"series": series->{title,"slug":slug.current,form}`
const POST_CARD = `_id,title,"slug":slug.current,${POST_SERIES},excerpt,publishedAt,cover`
const LISTED_POST = `_type=="post" && defined(slug.current) && defined(series->slug.current)`
/** A Rejection File's other part: enough to link it. */
const PART = `title,"slug":slug.current,"series":series->slug.current`
const SERIES_FIELDS = `_id,title,"slug":slug.current,intro,form`

export const SITE_SETTINGS_QUERY = defineQuery(`*[_type=="siteSettings" && _id=="siteSettings"][0]{
  ...,
  "homeSeries": homeSeries->{title,"slug":slug.current},
  "homeImageLqip": homeImage.asset->metadata.lqip,
  "cloudHex": cloudColor.hex
}`)

/** Stories that rotate through the home page's first screen: toggled on, with their art, in Stories order. */
export const HOME_SPOTLIGHT_QUERY = defineQuery(
  `*[_type=="book" && showOnHome == true && defined(homeArt.asset) && defined(slug.current)]|order(order asc, title asc){${BOOK_CARD},homeArt,"homeArtLqip": homeArt.asset->metadata.lqip,"cloudHex": cloudColor.hex,"cloudOn": coalesce(showCloud, true)}`,
)

export const BOOKS_QUERY = defineQuery(`*[_type=="book" && defined(slug.current)]|order(order asc, title asc){${BOOK_CARD}}`)

export const BOOK_QUERY = defineQuery(`*[_type=="book" && slug.current==$slug][0]{${BOOK_CARD},description,publishDate}`)

export const POSTS_QUERY = defineQuery(`*[${LISTED_POST}]|order(publishedAt desc){${POST_CARD}}`)

/** A post at /short-form/[series]/[slug]: both must match, so a post is only ever at its own series' address. */
export const POST_QUERY = defineQuery(
  `*[_type=="post" && slug.current==$slug && series->slug.current==$series][0]{${POST_CARD},body,pitch,script,"became": became{note,"story": story->{${BOOK_CARD}}},"follows": follows->{${PART}},"continuedIn": *[${LISTED_POST} && follows._ref == ^._id]|order(publishedAt asc)[0]{${PART}}}`,
)

/** The Short Form page: each series in order, with its newest posts. */
export const SERIES_LIST_QUERY = defineQuery(
  `*[_type=="series" && defined(slug.current)]|order(order asc, title asc){${SERIES_FIELDS},"posts": *[${LISTED_POST} && references(^._id)]|order(publishedAt desc)[0...4]{${POST_CARD}}}`,
)

/** A series' page: the series, and all its posts, newest first. */
export const SERIES_QUERY = defineQuery(
  `*[_type=="series" && slug.current==$series][0]{${SERIES_FIELDS},"posts": *[${LISTED_POST} && references(^._id)]|order(publishedAt desc){${POST_CARD}}}`,
)

/** The home page's post previews, from the featured series (Site settings), or every series without one: featured posts first, then newest, up to 7. */
export const HOME_POSTS_QUERY = defineQuery(
  `*[${LISTED_POST} && (!defined(*[_id=="siteSettings"][0].homeSeries) || series._ref == *[_id=="siteSettings"][0].homeSeries._ref)]{${POST_CARD},"pinned": coalesce(featured, false)}|order(pinned desc, publishedAt desc)[0...7]`,
)

export const PAGE_QUERY = defineQuery(`*[_type=="page" && slug.current==$slug][0]{_id,title,"slug":slug.current,intro,body}`)
