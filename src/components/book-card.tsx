import Image from 'next/image'
import { TransitionLink } from '@/components/transition-link'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { BookCardData, BookStatus } from '@/lib/types'
import { urlFor } from '@/sanity/image'

/**
 * Status, by what it asks of the reader: available books are quiet, upcoming
 * ones glow (ember, light on its way), and a live Kickstarter is the red
 * action.
 */
const STATUS_VARIANT: Record<BookStatus, React.ComponentProps<typeof Badge>['variant']> = {
  Available: 'secondary',
  Upcoming: 'ember',
  'On Kickstarter': 'default',
  'In development': 'outline',
}

export function StatusBadge({ status }: { status: BookStatus | null }) {
  if (!status) return null
  return <Badge variant={STATUS_VARIANT[status]}>{status}</Badge>
}

/**
 * A story's status and format side by side: the status filled (what it asks of
 * the reader), the format outlined (what it is: Novel, Comic). Together they
 * say "this is a book, and here's how to get it."
 */
export function BookBadges({ status, format }: { status: BookStatus | null; format?: string | null }) {
  if (!status && !format) return null
  return (
    <span className="flex flex-wrap gap-2">
      <StatusBadge status={status} />
      {format && <Badge variant="outline">{format}</Badge>}
    </span>
  )
}

/**
 * A book's cover at 2:3. Covers never break: without an image, the title is
 * set on a card with the fox-red spine, so a book can be listed before its
 * art is final. The image has empty alt text because the title is always
 * right beside it.
 */
export function BookCover({
  cover,
  title,
  series,
  sizes = '(max-width: 640px) 50vw, 280px',
  preload,
  loading,
  className,
}: {
  cover: BookCardData['cover']
  title: string
  series?: string | null
  sizes?: string
  /** For the page's largest image (its LCP). */
  preload?: boolean
  /** `eager` for a cover above the fold that isn't the LCP. */
  loading?: 'eager' | 'lazy'
  className?: string
}) {
  const frame = cn('rounded-ui relative aspect-[2/3] w-full overflow-hidden', className)
  if (cover?.asset) {
    return (
      <div className={cn(frame, 'bg-card')}>
        <Image src={urlFor(cover).width(800).height(1200).fit('crop').url()} alt="" fill sizes={sizes} preload={preload} loading={loading} className="object-cover" />
      </div>
    )
  }
  return (
    // Two across on phones, a cover is about 150px wide: the title steps down so long words fit.
    <div className={cn(frame, 'bg-card border-border border-l-fox flex flex-col justify-between border border-l-4 p-4 sm:p-5')}>
      <p className="font-serif text-lg leading-tight font-semibold break-words hyphens-auto sm:text-2xl">{title}</p>
      {series && <p className="text-muted-foreground text-xs font-semibold tracking-[0.14em] uppercase">{series}</p>}
    </div>
  )
}

/**
 * A book in a grid. The whole card is one click target (the title's link
 * stretches over it), so the cover, title, and blurb all open the book.
 */
export function BookCard({ book, headingLevel: Heading = 'h3' }: { book: BookCardData; headingLevel?: 'h2' | 'h3' | 'h4' }) {
  return (
    <article className="group relative flex flex-col gap-4">
      <BookCover cover={book.cover} title={book.title} series={book.series} className="transition-transform group-hover:-translate-y-1" />
      <div className="flex flex-col gap-2">
        <BookBadges status={book.status} format={book.format} />
        <Heading className="font-serif text-xl leading-snug font-semibold">
          <TransitionLink
            href={`/stories/${book.slug}`}
            className="group-hover:text-link after:rounded-ui focus-visible:after:outline-ring after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4"
          >
            {book.title}
          </TransitionLink>
        </Heading>
        {book.series && <p className="text-muted-foreground text-sm">{book.series}</p>}
        {book.shortDescription && <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">{book.shortDescription}</p>}
      </div>
    </article>
  )
}

/** Stories in a grid: two across on phones, up to four on wide screens. */
export function BookGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">{children}</div>
}
