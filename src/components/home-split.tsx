import Image from 'next/image'
import Link from 'next/link'

import { BookCover, StatusBadge } from '@/components/book-card'
import { BookSpotlight, type SpotlightSlide } from '@/components/book-spotlight'
import { BuyLinks } from '@/components/buy-links'
import { ButtonLink } from '@/components/ui/button'
import { EmptyState, Eyebrow } from '@/components/ui/section'
import type { SiteSettings } from '@/lib/site-settings'
import type { BookCardData, SanityImage, SpotlightBook } from '@/lib/types'
import { urlFor } from '@/sanity/image'

type Levels = { tagline: 'h1' | 'h4'; book: 'h2' | 'h4' }

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
      sizes="(orientation: landscape) and (min-width: 48rem) 50vw, 100vw"
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
 */
export function HomeSplit({
  settings,
  spotlight,
  fallbackBook,
  levels = { tagline: 'h1', book: 'h2' },
  preload = false,
  className,
}: {
  settings: SiteSettings
  spotlight: SpotlightBook[]
  /** Shown with the site's art when no book is in the spotlight: usually the first book. */
  fallbackBook: BookCardData | null
  /** Heading levels: the page's h1 and h2, or nested ones on the styleguide. */
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
          // The book's cloud, or the site's.
          cloud: book.cloudHex ?? settings.cloudHex,
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
          details: fallbackBook ? <BookDetails book={fallbackBook} settings={settings} level={levels.book} withCover /> : <EmptyState>{settings.booksEmpty}</EmptyState>,
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
          <Tagline className="font-serif text-6xl leading-[1.05] font-semibold tracking-tight">{settings.tagline}</Tagline>
          <p className="text-muted-foreground mt-4 max-w-md text-lg leading-relaxed sm:text-xl">{settings.homeIntro}</p>
        </div>
      }
      eyebrow={hasBook && <Eyebrow className="mb-5">{settings.featuredBookLabel}</Eyebrow>}
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
        <Link href={href} className="hover:text-link">
          {book.title}
        </Link>
      </Heading>
      {book.series && <p className="text-muted-foreground text-sm">{book.series}</p>}
      {book.shortDescription && <p className="text-muted-foreground line-clamp-3 leading-relaxed sm:line-clamp-4">{book.shortDescription}</p>}
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
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
        <BuyLinks links={book.buyLinks} label={settings.buyLabel} />
        <ButtonLink href={href} variant="link" className="px-0">
          {settings.bookDetailsLabel}
        </ButtonLink>
      </div>
    </div>
  )
}
