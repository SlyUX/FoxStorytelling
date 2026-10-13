import type {
  BOOK_QUERY_RESULT,
  BOOKS_QUERY_RESULT,
  BuyLink,
  FEATURED_POST_QUERY_RESULT,
  HOME_SPOTLIGHT_QUERY_RESULT,
  ImageWithAlt,
  Link,
  PAGE_QUERY_RESULT,
  POST_QUERY_RESULT,
  POSTS_QUERY_RESULT,
  RichText as GeneratedRichText,
} from '../../sanity.types'

/**
 * Readable names for generated Sanity types. Never hand-write field lists
 * here: run `npm run typegen` and alias the result.
 */
export type CmsLink = Link
export type CmsBuyLink = { _key: string } & BuyLink
export type SanityImage = ImageWithAlt
export type RichText = GeneratedRichText
export type BookCardData = BOOKS_QUERY_RESULT[number]
export type BookDetail = NonNullable<BOOK_QUERY_RESULT>
export type SpotlightBook = HOME_SPOTLIGHT_QUERY_RESULT[number]
export type BookStatus = NonNullable<BookCardData['status']>
export type PostCardData = POSTS_QUERY_RESULT[number]
export type PostDetail = NonNullable<POST_QUERY_RESULT>
export type FeaturedPost = FEATURED_POST_QUERY_RESULT
export type PageDetail = NonNullable<PAGE_QUERY_RESULT>
