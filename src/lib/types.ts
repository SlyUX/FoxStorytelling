import type {
  BOOK_QUERY_RESULT,
  BOOKS_QUERY_RESULT,
  BuyLink,
  HOME_POSTS_QUERY_RESULT,
  HOME_SPOTLIGHT_QUERY_RESULT,
  ImageWithAlt,
  Link,
  PAGE_QUERY_RESULT,
  POST_QUERY_RESULT,
  POSTS_QUERY_RESULT,
  SERIES_LIST_QUERY_RESULT,
  SERIES_QUERY_RESULT,
  RichText as GeneratedRichText,
  Screenplay as GeneratedScreenplay,
} from '../../sanity.types'

/**
 * Readable names for generated Sanity types. Never hand-write field lists
 * here: run `npm run typegen` and alias the result.
 */
export type CmsLink = Link
export type CmsBuyLink = { _key: string } & BuyLink
export type SanityImage = ImageWithAlt
export type RichText = GeneratedRichText
export type Screenplay = GeneratedScreenplay
export type BookCardData = BOOKS_QUERY_RESULT[number]
export type BookDetail = NonNullable<BOOK_QUERY_RESULT>
export type SpotlightBook = HOME_SPOTLIGHT_QUERY_RESULT[number]
export type BookStatus = NonNullable<BookCardData['status']>
export type PostCardData = POSTS_QUERY_RESULT[number]
export type HomePost = HOME_POSTS_QUERY_RESULT[number]
export type PostDetail = NonNullable<POST_QUERY_RESULT>
export type SeriesSummary = SERIES_LIST_QUERY_RESULT[number]
export type SeriesDetail = NonNullable<SERIES_QUERY_RESULT>
/** A post's series, as every post query brings it. */
export type PostSeries = PostCardData['series']
export type PageDetail = NonNullable<PAGE_QUERY_RESULT>
