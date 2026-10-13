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
const POST_CARD = `_id,title,"slug":slug.current,category,excerpt,publishedAt`

export const SITE_SETTINGS_QUERY = defineQuery(`*[_type=="siteSettings" && _id=="siteSettings"][0]{
  ...,
  "homeImageLqip": homeImage.asset->metadata.lqip,
  "cloudHex": cloudColor.hex
}`)

/** Stories that rotate through the home page's first screen: toggled on, with their art, in Stories order. */
export const HOME_SPOTLIGHT_QUERY = defineQuery(
  `*[_type=="book" && showOnHome == true && defined(homeArt.asset) && defined(slug.current)]|order(order asc, title asc){${BOOK_CARD},homeArt,"homeArtLqip": homeArt.asset->metadata.lqip,"cloudHex": cloudColor.hex,"cloudOn": coalesce(showCloud, true)}`,
)

export const BOOKS_QUERY = defineQuery(`*[_type=="book" && defined(slug.current)]|order(order asc, title asc){${BOOK_CARD}}`)

export const BOOK_QUERY = defineQuery(`*[_type=="book" && slug.current==$slug][0]{${BOOK_CARD},description,publishDate}`)

export const POSTS_QUERY = defineQuery(`*[_type=="post" && defined(slug.current)]|order(publishedAt desc){${POST_CARD}}`)

export const POST_QUERY = defineQuery(`*[_type=="post" && slug.current==$slug][0]{${POST_CARD},cover,body}`)

/** The home page's post previews: featured posts first, then newest. */
export const HOME_POSTS_QUERY = defineQuery(
  `*[_type=="post" && defined(slug.current)]{${POST_CARD},"pinned": coalesce(featured, false)}|order(pinned desc, publishedAt desc)[0...6]`,
)

export const PAGE_QUERY = defineQuery(`*[_type=="page" && slug.current==$slug][0]{_id,title,"slug":slug.current,intro,body}`)
