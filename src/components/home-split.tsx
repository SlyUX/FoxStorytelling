import Image from 'next/image'

import { BookCover, StatusBadge } from '@/components/book-card'
import { BookSpotlight, type SpotlightSlide } from '@/components/book-spotlight'
import { BuyLinks } from '@/components/buy-links'
import { FillColumn } from '@/components/fill-column'
import { PostCard } from '@/components/post-list'
import { TransitionLink } from '@/components/transition-link'
import { ButtonLink } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/section'
import type { SiteSettings } from '@/lib/site-settings'
import type { BookCardData, HomePost, SanityImage, SpotlightBook } from '@/lib/types'
import { cn } from '@/lib/utils'
import { urlFor } from '@/sanity/image'

/** Heading levels: the page's h1, the book's title, block headings, and titles in blocks. */
type Levels = { tagline: 'h1' | 'h4'; book: 'h2' | 'h5'; block: 'h2' | 'h5'; item: 'h3' | 'h6' }
const PAGE_LEVELS: Levels = { tagline: 'h1', book: 'h2', block: 'h2', item: 'h3' }
/** Below `split:`, everything flows; this many post previews show there. */
const POSTS_STACKED = 3

/** The hotspot as a CSS position; without one, a little above center. */
const focusOf = (image: SanityImage | null | undefined) => (image?.hotspot ? `${(image.hotspot.x * 100).toFixed(1)}% ${(image.hotspot.y * 100).toFixed(1)}%` : '50% 40%')

function Art({ image, lqip, focus, preload }: { image: SanityImage | null | undefined; lqip?: string | null; focus: string; preload?: boolean }) {
  if (!image?.asset) return null
  return (
    <Image
      src={urlFor(image).width(2000).fit('max').url()}
      alt={image.alt ?? ''}
      fill
      preload={preload}
      sizes="(orientation: landscape) and (min-width: 48rem) and (min-height: 36rem) 50vw, 100vw"
      placeholder={lqip ? 'blur' : 'empty'}
      blurDataURL={lqip ?? undefined}
      className="object-cover"
      style={{ objectPosition: focus }}
    />
  )
}

/**
 * The home page's first screen (see BookSpotlight). Books set to show on the
 * home page, with their art, rotate one per breath in Books order, each one's
 * details over the foot of its art. Without any, the site's home art (Site
 * settings) stands with the first book.
 *
 * The other column, centered: the description, with Stephen's Bio (once
 * there's an About page) and All books; then the Rejection Files previews, as
 * many as fit (FillColumn).
 */
export function HomeSplit({
  settings,
  spotlight,
  fallbackBook,
  posts,
  aboutExists,
  levels = PAGE_LEVELS,
  preload = false,
  className,
}: {
  settings: SiteSettings
  spotlight: SpotlightBook[]
  /** Shown with the site's art when no book is in the spotlight: usually the first book. */
  fallbackBook: BookCardData | null
  /** Featured posts first, then newest. */
  posts: HomePost[]
  /** Whether there's an About page for Stephen's Bio to open. */
  aboutExists: boolean
  /** Heading levels: the page's, or nested ones on the styleguide. */
  levels?: Levels
  /** Preload the first art: it's the home page's largest image. */
  preload?: boolean
  className?: string
}) {
  const Tagline = levels.tagline
  const homeFocus = focusOf(settings.homeImage)
  const slides: SpotlightSlide[] = spotlight.length
    ? spotlight.map((book, i) => {
        const focus = focusOf(book.homeArt)
        return {
          key: book._id,
          title: book.title,
          focus,
          // The book's cloud, or the site's; a book can turn it off.
          cloud: book.cloudHex ?? settings.cloudHex,
          cloudOn: book.cloudOn,
          art: <Art image={book.homeArt} lqip={book.homeArtLqip} focus={focus} preload={preload && i === 0} />,
          details: <BookDetails book={book} settings={settings} level={levels.book} />,
        }
      })
    : [
        {
          key: 'home',
          title: settings.title,
          focus: homeFocus,
          cloud: settings.cloudHex,
          art: <Art image={settings.homeImage} lqip={settings.homeImageLqip} focus={homeFocus} preload={preload} />,
          details: fallbackBook && <BookDetails book={fallbackBook} settings={settings} level={levels.book} withCover />,
        },
      ]
  const hasBook = spotlight.length > 0 || !!fallbackBook

  return (
    <BookSpotlight
      className={className}
      label={settings.booksTitle}
      slides={slides}
      intro={
        <>
          <Tagline className="font-serif text-5xl leading-[1.05] font-semibold tracking-tight">{settings.tagline}</Tagline>
          <p className="text-muted-foreground mt-3 max-w-md text-lg leading-relaxed">{settings.homeIntro}</p>
          {(aboutExists || hasBook) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {aboutExists && (
                <ButtonLink href="/about" variant="outline">
                  {settings.bioLabel}
                </ButtonLink>
              )}
              {hasBook && (
                <ButtonLink href="/books" variant="outline">
                  {settings.allBooksLabel}
                </ButtonLink>
              )}
            </div>
          )}
        </>
      }
      rest={
        <FillColumn>
          {/* The heading travels with the first preview, so it never shows alone. */}
          <div className="border-border mt-10 border-t pt-8">
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <Eyebrow as={levels.block}>{settings.blogTitle}</Eyebrow>
              <TransitionLink href="/blog" className="text-link text-sm font-semibold underline-offset-4 hover:underline">
                {settings.allPostsLabel}
              </TransitionLink>
            </div>
            {posts[0] ? <PostCard post={posts[0]} featuredLabel={settings.featuredLabel} headingLevel={levels.item} /> : <p className="text-muted-foreground">{settings.postsEmpty}</p>}
          </div>
          {posts.slice(1).map((post, i) => (
            <div key={post._id} className={cn('mt-3', i + 1 >= POSTS_STACKED && 'split:block hidden')}>
              <PostCard post={post} featuredLabel={settings.featuredLabel} headingLevel={levels.item} />
            </div>
          ))}
        </FillColumn>
      }
    />
  )
}

/** A book's status, title, series, and blurb, then where to buy it. The cover joins when the art beside it isn't the book's own. */
function BookDetails({ book, settings, level: Heading, withCover = false }: { book: BookCardData; settings: SiteSettings; level: Levels['book']; withCover?: boolean }) {
  const href = `/books/${book.slug}`
  const text = (
    <div className="flex flex-col items-start gap-3">
      <StatusBadge status={book.status} />
      <Heading className="font-serif text-3xl leading-tight font-semibold">
        <TransitionLink href={href} className="hover:text-link">
          {book.title}
        </TransitionLink>
      </Heading>
      {book.series && <p className="text-muted-foreground text-sm">{book.series}</p>}
      {book.shortDescription && <p className="text-muted-foreground line-clamp-2 leading-relaxed sm:line-clamp-3">{book.shortDescription}</p>}
    </div>
  )
  return (
    <div>
      {withCover ? (
        <div className="split:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] grid grid-cols-[6.5rem_minmax(0,1fr)] items-start gap-5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-8">
          <BookCover cover={book.cover} title={book.title} series={book.series} sizes="(max-width: 640px) 104px, 160px" loading="eager" />
          {text}
        </div>
      ) : (
        text
      )}
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
        <BuyLinks links={book.buyLinks} label={settings.buyLabel} />
        <ButtonLink href={href} variant="link" className="px-0">
          {settings.bookDetailsLabel}
        </ButtonLink>
      </div>
    </div>
  )
}
