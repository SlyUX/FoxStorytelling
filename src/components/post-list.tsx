import Image from 'next/image'

import { FoxBadge } from '@/components/fox-badge'
import { TransitionLink } from '@/components/transition-link'
import { Eyebrow } from '@/components/ui/section'
import { formatDate } from '@/lib/utils'
import type { PostCardData } from '@/lib/types'
import { urlFor } from '@/sanity/image'

/** A post's address: under its series, in Short Form. */
export const postHref = (post: Pick<PostCardData, 'slug' | 'series'>) => `/short-form/${post.series.slug}/${post.slug}`

/** Poems are read whole, so lists and cards give no excerpt of one. */
const excerptOf = (post: Pick<PostCardData, 'excerpt' | 'series'>) => (post.series.form === 'poetry' ? null : post.excerpt)

/**
 * A post in a list: series, title, date, and excerpt, divided by rules. A
 * series' own page leaves out its name (`showSeries={false}`).
 * The whole row is one click target. A visited title turns near-white and
 * underlined. Browsers let :visited change only colors, and not their
 * transparency, so the underline is always there, drawn in the ground's own
 * color until the post has been read.
 */
export function PostRow({ post, showSeries = true, headingLevel: Heading = 'h3' }: { post: PostCardData; showSeries?: boolean; headingLevel?: 'h2' | 'h3' | 'h4' }) {
  const date = formatDate(post.publishedAt)
  const excerpt = excerptOf(post)
  return (
    <article className="group relative py-6">
      {showSeries && <Eyebrow className="mb-2">{post.series.title}</Eyebrow>}
      <Heading className="font-heading text-2xl leading-snug font-semibold">
        <TransitionLink
          href={postHref(post)}
          className="group-hover:text-link visited:text-visited decoration-background visited:decoration-visited underline underline-offset-4 focus-visible:after:outline-ring after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2"
        >
          {post.title}
        </TransitionLink>
      </Heading>
      {date && (
        <p className="text-muted-foreground mt-1 text-sm">
          <time dateTime={post.publishedAt}>{date}</time>
        </p>
      )}
      {excerpt && <p className="text-muted-foreground mt-3 max-w-2xl leading-relaxed">{excerpt}</p>}
    </article>
  )
}

export function PostList({ posts, showSeries, headingLevel }: { posts: PostCardData[]; showSeries?: boolean; headingLevel?: 'h2' | 'h3' | 'h4' }) {
  return (
    <ul className="divide-border border-border divide-y border-y">
      {posts.map((post) => (
        <li key={post._id}>
          <PostRow post={post} showSeries={showSeries} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  )
}

/**
 * A post as a compact card, for tight spaces like the home page's first
 * screen: a square of the post's cover, flush to the card's top, left, and
 * bottom, then the meta line (series and date; just the date where the series
 * goes without saying, `showSeries={false}`), title, and excerpt (on wider
 * screens; never a poem's). One click
 * target; pointing at it or focusing it draws the cover in a little, unless
 * motion is reduced. Without a cover, the square holds the fox badge. Featured
 * posts lead their list and say so.
 *
 * The text is clamped to fit beside the square, so the card is as tall as
 * the square is wide. Were the text ever taller, the square would stretch to
 * meet the bottom edge rather than leave a gap.
 */
export function PostCard({
  post,
  featuredLabel,
  showSeries = true,
  headingLevel: Heading = 'h3',
}: {
  post: PostCardData & { pinned?: boolean }
  featuredLabel?: string
  showSeries?: boolean
  headingLevel?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}) {
  const date = formatDate(post.publishedAt)
  const meta = [showSeries && post.series.title, date].filter(Boolean).join(' · ')
  const excerpt = excerptOf(post)
  return (
    <article className="group bg-card rounded-ui relative flex">
      {/* Decorative: the title beside it names the post. */}
      <div className="bg-muted rounded-l-ui relative aspect-square w-28 shrink-0 overflow-hidden sm:w-40">
        {post.cover?.asset ? (
          <Image
            src={urlFor(post.cover).width(320).height(320).fit('crop').url()}
            alt=""
            fill
            sizes="(min-width: 40rem) 160px, 112px"
            className="object-cover transition-transform duration-500 ease-out motion-safe:group-focus-within:scale-105 motion-safe:group-hover:scale-105"
          />
        ) : (
          <FoxBadge className="text-border absolute inset-0 m-auto size-1/3" />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center p-4">
        <p className="text-muted-foreground truncate text-xs">
          {post.pinned && featuredLabel && <span className="text-link mr-2 font-semibold tracking-[0.14em] uppercase">{featuredLabel}</span>}
          {meta}
        </p>
        <Heading className="font-heading mt-1 line-clamp-2 text-lg leading-snug font-semibold sm:text-xl">
          <TransitionLink
            href={postHref(post)}
            className="group-hover:text-link visited:text-visited decoration-card visited:decoration-visited underline underline-offset-4 after:rounded-ui focus-visible:after:outline-ring after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2"
          >
            {post.title}
          </TransitionLink>
        </Heading>
        {excerpt && <p className="text-muted-foreground mt-1.5 hidden text-sm leading-relaxed sm:line-clamp-2">{excerpt}</p>}
      </div>
    </article>
  )
}
