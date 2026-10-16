import { BookCover } from '@/components/book-card'
import { BuyLinks } from '@/components/buy-links'
import { RichText } from '@/components/rich-text'
import { TransitionLink } from '@/components/transition-link'
import { ButtonLink } from '@/components/ui/button'
import type { PostDetail } from '@/lib/types'

/**
 * A Rejection File's epilogue, after the story: what the rejected work became.
 * The story it became (a book on this site), as a small card linking to its
 * page, with where to buy it (the story's own buy links, the first in ember),
 * and the author's words about it (rich text, its headings a level under this
 * one's); either, or both. Renders nothing without either.
 */
export function PostBecame({
  became,
  heading,
  linkLabel,
  buyLabel,
  headingLevel: Heading = 'h2',
  className,
}: {
  became: PostDetail['became']
  heading: string
  /** The story link's text ("About the book"). */
  linkLabel: string
  /** The buy buttons' text ("Buy on {store}"). */
  buyLabel: string
  headingLevel?: 'h2' | 'h3' | 'h4'
  className?: string
}) {
  const story = became?.story
  const note = became?.note
  // Notes saved before this field was rich text are plain text until resaved: shown as paragraphs, a blank line apart.
  const legacy = typeof note === 'string' ? (note as string).split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean) : []
  const hasNote = legacy.length > 0 || (Array.isArray(note) && note.length > 0)
  if (!story && !hasNote) return null
  const href = story ? `/stories/${story.slug}` : ''
  return (
    <section aria-labelledby="became-heading" className={className}>
      <Heading id="became-heading" className="font-heading text-3xl leading-tight font-semibold">
        {heading}
      </Heading>
      {legacy.length > 0 && (
        <div className="mt-5 space-y-5 text-xl leading-relaxed">
          {legacy.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}
      {Array.isArray(note) && note.length > 0 && (
        <div className="mt-5">
          <RichText value={note} nested />
        </div>
      )}
      {story && (
        <div className="bg-card rounded-ui mt-8 grid grid-cols-[6rem_minmax(0,1fr)] items-start gap-5 p-5 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-6">
          <BookCover cover={story.cover} title={story.title} series={story.series} sizes="128px" />
          <div className="flex flex-col items-start gap-2">
            {story.series && <p className="text-muted-foreground text-sm">{story.series}</p>}
            {/* Not a heading: the card is a pointer to the story's page, not a section of this one. */}
            <p className="font-display text-2xl leading-tight">
              <TransitionLink href={href} className="hover:text-link">
                {story.title}
              </TransitionLink>
            </p>
            {story.shortDescription && <p className="text-muted-foreground line-clamp-3 leading-relaxed">{story.shortDescription}</p>}
            <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-3">
              <BuyLinks links={story.buyLinks} label={buyLabel} lead="ember" />
              <ButtonLink href={href} variant="link">
                {linkLabel}
              </ButtonLink>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
