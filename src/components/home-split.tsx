import Image from 'next/image'

import { BookBadges, BookCover } from '@/components/book-card'
import { BookSpotlight, type SpotlightSlide } from '@/components/book-spotlight'
import { BuyLinks } from '@/components/buy-links'
import { Newsletter } from '@/components/newsletter'
import { PostCard } from '@/components/post-list'
import { TransitionLink } from '@/components/transition-link'
import { ButtonLink } from '@/components/ui/button'
import type { SiteSettings } from '@/lib/site-settings'
import type { BookCardData, HomePost, SanityImage, SpotlightBook } from '@/lib/types'
import { cn } from '@/lib/utils'
import { urlFor } from '@/sanity/image'

/** Heading levels: the page's h1, the book's title, block headings, and titles in blocks. */
type Levels = { tagline: 'h1' | 'h4'; book: 'h2' | 'h5'; block: 'h2' | 'h5'; item: 'h3' | 'h6' }
const PAGE_LEVELS: Levels = { tagline: 'h1', book: 'h2', block: 'h2', item: 'h3' }
/** Below `split:`, everything flows; this many post previews show there. Split screens show them all (up to 7, the query's cap), scrolling. */
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
 * The home page's first screen (see BookSpotlight). Stories set to show on the
 * home page, with their art, rotate one per breath in Stories order, each one's
 * details over the foot of its art. Without any, the site's home art (Site
 * settings) stands with the first book.
 *
 * The other column: the description, with All stories (the view's red
 * button) and Stephen's Bio (once there's an About page); then the featured
 * series' previews (Site settings; The Rejection Files). On split screens it
 * scrolls, with the sign-up bar pinned beneath it (once Site settings has a
 * sign-up address); stacked, the bar comes last.
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
  const Block = levels.block
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
      label={settings.featuredStoriesLabel}
      slides={slides}
      intro={
        <>
          <Tagline className="font-display text-ember text-5xl leading-[1.05] uppercase">{settings.tagline}</Tagline>
          <div className="mt-4 flex items-center gap-4">
            {/* The author's portrait, round: the one exception to the 2px corners. Blank alt by default: the intro names him. */}
            {settings.authorPhoto?.asset && (
              <Image
                src={urlFor(settings.authorPhoto).width(192).height(192).fit('crop').url()}
                alt={settings.authorPhoto.alt ?? ''}
                width={96}
                height={96}
                loading="eager"
                className="bg-card size-14 shrink-0 rounded-full sm:size-16"
              />
            )}
            <p className="text-muted-foreground max-w-md text-lg leading-relaxed">{settings.homeIntro}</p>
          </div>
          {(aboutExists || hasBook) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {hasBook && <ButtonLink href="/stories">{settings.allBooksLabel}</ButtonLink>}
              {aboutExists && (
                <ButtonLink href="/about" variant="outline">
                  {settings.bioLabel}
                </ButtonLink>
              )}
            </div>
          )}
        </>
      }
      rest={
        // Stacked, inset like the description; on split screens the column insets it. Ruled off from the description
        // on split screens; stacked, the art's band above already draws that line.
        <div className="split:p-0 px-6 pb-12 sm:px-10">
          <div className="border-border split:border-t split:pt-8 mt-10">
            <div className="mb-4 flex items-baseline justify-between gap-4">
              {/* Set like an h3 (white, 24px), but an h2 in the outline: a main section of the page, not part of the book above it. */}
              <Block className="font-heading text-2xl leading-snug font-semibold text-white">{settings.homeSeries?.title ?? settings.shortFormTitle}</Block>
              <ButtonLink href={settings.homeSeries ? `/short-form/${settings.homeSeries.slug}` : '/short-form'} variant="link" className="h-auto text-sm">
                {settings.allPostsLabel}
              </ButtonLink>
            </div>
            {posts.length ? (
              <ul className="grid gap-3">
                {posts.map((post, i) => (
                  <li key={post._id} className={cn(i >= POSTS_STACKED && 'split:block hidden')}>
                    <PostCard post={post} featuredLabel={settings.featuredLabel} showSeries={!settings.homeSeries} headingLevel={levels.item} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">{settings.postsEmpty}</p>
            )}
          </div>
        </div>
      }
      footer={settings.newsletterForm ? <Newsletter settings={settings} layout="bar" id="subscribe-heading" headingLevel={levels.block} /> : null}
    />
  )
}

/** A book's status, title, series, and blurb, then where to buy it. The cover joins when the art beside it isn't the book's own. */
function BookDetails({ book, settings, level: Heading, withCover = false }: { book: BookCardData; settings: SiteSettings; level: Levels['book']; withCover?: boolean }) {
  const href = `/stories/${book.slug}`
  const text = (
    <div className="flex flex-col items-start gap-3">
      <BookBadges status={book.status} format={book.format} />
      <Heading className="font-display text-4xl leading-tight">
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
        {/* Ember: All stories is this view's red button. */}
        <BuyLinks links={book.buyLinks} label={settings.buyLabel} lead="ember" />
        <ButtonLink href={href} variant="link" className="px-0">
          {settings.bookDetailsLabel}
        </ButtonLink>
      </div>
    </div>
  )
}
