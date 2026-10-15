import { BookCover } from '@/components/book-card'
import { TransitionLink } from '@/components/transition-link'
import { ButtonLink } from '@/components/ui/button'
import type { PostDetail } from '@/lib/types'

/**
 * A Rejection File's epilogue, after the story: what the rejected work became.
 * The story it became (a book on this site), as a small card linking to its
 * page, and the author's words about it; either, or both. Renders nothing
 * without either.
 */
export function PostBecame({
  became,
  heading,
  linkLabel,
  headingLevel: Heading = 'h2',
  className,
}: {
  became: PostDetail['became']
  heading: string
  /** The story link's text ("About the book"). */
  linkLabel: string
  headingLevel?: 'h2' | 'h3' | 'h4'
  className?: string
}) {
  const story = became?.story
  const paragraphs = (became?.note ?? '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
  if (!story && !paragraphs.length) return null
  const href = story ? `/stories/${story.slug}` : ''
  return (
    <section aria-labelledby="became-heading" className={className}>
      <Heading id="became-heading" className="font-heading text-3xl leading-tight font-semibold">
        {heading}
      </Heading>
      {paragraphs.length > 0 && (
        <div className="mt-5 space-y-5 text-xl leading-relaxed">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
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
            <ButtonLink href={href} variant="link" className="mt-1">
              {linkLabel}
            </ButtonLink>
          </div>
        </div>
      )}
    </section>
  )
}
