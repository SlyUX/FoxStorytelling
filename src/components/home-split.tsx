import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown } from 'lucide-react'

import { BookCover, StatusBadge } from '@/components/book-card'
import { BookSpotlight, type SpotlightSlide } from '@/components/book-spotlight'
import { BuyLinks } from '@/components/buy-links'
import { FillColumn } from '@/components/fill-column'
import { PostCard } from '@/components/post-list'
import { ButtonLink } from '@/components/ui/button'
import { EmptyState, Eyebrow } from '@/components/ui/section'
import type { SiteSettings } from '@/lib/site-settings'
import type { BookCardData, HomePost, SanityImage, SpotlightBook } from '@/lib/types'
import { cn } from '@/lib/utils'
import { urlFor } from '@/sanity/image'

/** Heading levels: the page's h1, block headings, and titles in blocks. */
type Levels = { tagline: 'h1' | 'h4'; block: 'h2' | 'h5'; item: 'h3' | 'h6' }
const PAGE_LEVELS: Levels = { tagline: 'h1', block: 'h2', item: 'h3' }
/** Below `split:`, everything flows; this many post previews show there. */
const POSTS_STACKED = 3

/** The hotspot as a CSS position; without one, a little above center. */
const focusOf = (image: SanityImage | null | undefined) =>
  image?.hotspot ? `${(image.hotspot.x * 100).toFixed(1)}% ${(image.hotspot.y * 100).toFixed(1)}%` : '50% 40%'

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
 * home page, with their art, rotate one per breath in Books order. Without
 * any, the site's home art (Site settings) stands beside the first book.
 *
 * The column beside the art flows: the description; the book, with "All books"
 * gliding down to the Books section; then the About preview and the Rejection
 * Files previews, as far as they fit (FillColumn), every block set off by a
 * rule.
 */
export function HomeSplit({
  settings,
  spotlight,
  fallbackBook,
  posts,
  aboutExists,
  booksHref = '#books',
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
  /** Whether there's an About page to link the preview to. */
  aboutExists: boolean
  /** Where "All books" goes: the Books section below. */
  booksHref?: string
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
          details: <BookDetails book={book} settings={settings} level={levels.item} />,
        }
      })
    : [
        {
          key: 'home',
          title: settings.title,
          focus: homeFocus,
          cloud: settings.cloudHex,
          art: <Art image={settings.homeImage} lqip={settings.homeImageLqip} focus={homeFocus} preload={preload} />,
          details: fallbackBook ? <BookDetails book={fallbackBook} settings={settings} level={levels.item} withCover /> : <EmptyState>{settings.booksEmpty}</EmptyState>,
        },
      ]
  const hasBook = spotlight.length > 0 || !!fallbackBook

  return (
    <BookSpotlight
      className={className}
      label={settings.booksTitle}
      slides={slides}
      intro={
        <div>
          <Tagline className="font-serif text-5xl leading-[1.05] font-semibold tracking-tight">{settings.tagline}</Tagline>
          <p className="text-muted-foreground mt-3 max-w-md text-lg leading-relaxed">{settings.homeIntro}</p>
        </div>
      }
      eyebrow={
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <Eyebrow as={levels.block}>{hasBook ? settings.featuredBookLabel : settings.booksTitle}</Eyebrow>
          {hasBook && (
            <a href={booksHref} className="text-link inline-flex items-center gap-1 text-sm font-semibold underline-offset-4 hover:underline">
              {settings.allBooksLabel}
              <ArrowDown aria-hidden className="size-4" />
            </a>
          )}
        </div>
      }
      more={
        <FillColumn>
          <div className="border-border mt-8 border-t pt-8">
            <Eyebrow as={levels.block} className="mb-3">
              {settings.aboutLabel}
            </Eyebrow>
            <p className="text-muted-foreground max-w-xl leading-relaxed">{settings.aboutPreview}</p>
            {aboutExists && (
              <ButtonLink href="/about" variant="link" className="mt-2 h-auto px-0">
                {settings.aboutLinkLabel}
              </ButtonLink>
            )}
          </div>
          {/* The heading travels with the first preview, so it never shows alone. */}
          <div className="border-border mt-8 border-t pt-8">
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <Eyebrow as={levels.block}>{settings.blogTitle}</Eyebrow>
              <Link href="/blog" className="text-link text-sm font-semibold underline-offset-4 hover:underline">
                {settings.allPostsLabel}
              </Link>
            </div>
            {posts[0] ? (
              <PostCard post={posts[0]} featuredLabel={settings.featuredLabel} headingLevel={levels.item} />
            ) : (
              <p className="text-muted-foreground">{settings.postsEmpty}</p>
            )}
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
function BookDetails({ book, settings, level: Heading, withCover = false }: { book: BookCardData; settings: SiteSettings; level: Levels['item']; withCover?: boolean }) {
  const href = `/books/${book.slug}`
  const text = (
    <div className="flex flex-col items-start gap-3">
      <StatusBadge status={book.status} />
      <Heading className="font-serif text-3xl leading-tight font-semibold">
        <Link href={href} className="hover:text-link">
          {book.title}
        </Link>
      </Heading>
      {book.series && <p className="text-muted-foreground text-sm">{book.series}</p>}
      {book.shortDescription && <p className="text-muted-foreground line-clamp-3 leading-relaxed">{book.shortDescription}</p>}
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
