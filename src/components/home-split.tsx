import Image from 'next/image'
import Link from 'next/link'

import { BookCover, StatusBadge } from '@/components/book-card'
import { BreathingArt } from '@/components/breathing-art'
import { BuyLinks } from '@/components/buy-links'
import { ButtonLink } from '@/components/ui/button'
import { EmptyState, Eyebrow } from '@/components/ui/section'
import type { SiteSettings } from '@/lib/site-settings'
import type { BookCardData } from '@/lib/types'
import { cn } from '@/lib/utils'
import { urlFor } from '@/sanity/image'

type Levels = { tagline: 'h1' | 'h4'; book: 'h2' | 'h4' }

/**
 * The home page's first screen: the art and headline beside the featured
 * book, in two equal columns on landscape screens from tablet width (`split:`)
 * and two equal rows below that. Edge to edge, filling everything under the
 * header. A row grows past half only if its content needs the room.
 */
export function HomeSplit({
  settings,
  book,
  levels = { tagline: 'h1', book: 'h2' },
  preload = false,
  className,
}: {
  settings: SiteSettings
  book: BookCardData | null
  /** Heading levels: the page's h1 and h2, or nested ones on the styleguide. */
  levels?: Levels
  /** Preload the art: it's the home page's largest image. */
  preload?: boolean
  className?: string
}) {
  const image = settings.homeImage
  // The hotspot set in the Studio stays in view and is where the breath grows from.
  const focus = image?.hotspot ? `${(image.hotspot.x * 100).toFixed(1)}% ${(image.hotspot.y * 100).toFixed(1)}%` : '50% 40%'
  const Tagline = levels.tagline

  return (
    <div className={cn('split:grid-cols-2 split:grid-rows-[1fr] grid min-h-[calc(100svh-var(--header-h))] grid-rows-[1fr_1fr]', className)}>
      <BreathingArt
        focus={focus}
        className="min-h-72"
        art={
          image?.asset && (
            <Image
              src={urlFor(image).width(2000).fit('max').url()}
              alt={image.alt ?? ''}
              fill
              preload={preload}
              sizes="(orientation: landscape) and (min-width: 48rem) 50vw, 100vw"
              placeholder={settings.homeImageLqip ? 'blur' : 'empty'}
              blurDataURL={settings.homeImageLqip ?? undefined}
              className="object-cover"
              style={{ objectPosition: focus }}
            />
          )
        }
      >
        {/* The headline sits on night at 70%: legible over any part of any image (see globals.css). */}
        <div className="absolute inset-x-0 bottom-0">
          <div aria-hidden className="from-background/70 h-24 bg-linear-to-t to-transparent" />
          <div className="bg-background/70 split:px-12 split:pb-12 px-6 pb-8 sm:px-10">
            <Tagline className="font-serif text-6xl leading-[1.05] font-semibold tracking-tight">{settings.tagline}</Tagline>
            <p className="mt-4 max-w-md text-lg leading-relaxed sm:text-xl">{settings.homeIntro}</p>
          </div>
        </div>
      </BreathingArt>

      <div className="split:px-12 flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-16">
        {book ? <FeaturedBook book={book} settings={settings} level={levels.book} /> : <EmptyState>{settings.booksEmpty}</EmptyState>}
      </div>
    </div>
  )
}

/** The featured book: cover beside its status, title, and blurb; then where to buy it. */
function FeaturedBook({ book, settings, level: Heading }: { book: BookCardData; settings: SiteSettings; level: Levels['book'] }) {
  const href = `/books/${book.slug}`
  return (
    <div className="mx-auto w-full max-w-xl">
      <Eyebrow className="mb-5">{settings.featuredBookLabel}</Eyebrow>
      <div className="split:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] grid grid-cols-[6.5rem_minmax(0,1fr)] items-start gap-5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-8">
        <BookCover cover={book.cover} title={book.title} series={book.series} sizes="(max-width: 640px) 104px, 192px" loading="eager" />
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
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
        <BuyLinks links={book.buyLinks} label={settings.buyLabel} />
        <ButtonLink href={href} variant="link" className="px-0">
          {settings.bookDetailsLabel}
        </ButtonLink>
      </div>
    </div>
  )
}
