import Link from 'next/link'

import { Eyebrow } from '@/components/ui/section'
import { formatDate } from '@/lib/utils'
import type { PostCardData } from '@/lib/types'

/**
 * A post in a list: category, title, date, and excerpt, divided by rules.
 * The whole row is one click target.
 */
export function PostRow({ post, headingLevel: Heading = 'h3' }: { post: PostCardData; headingLevel?: 'h2' | 'h3' | 'h4' }) {
  const date = formatDate(post.publishedAt)
  return (
    <article className="group relative py-6">
      {post.category && <Eyebrow className="mb-2">{post.category}</Eyebrow>}
      <Heading className="font-serif text-2xl leading-snug font-semibold">
        <Link
          href={`/blog/${post.slug}`}
          className="group-hover:text-link visited:text-visited focus-visible:after:outline-ring after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2"
        >
          {post.title}
        </Link>
      </Heading>
      {date && (
        <p className="text-muted-foreground mt-1 text-sm">
          <time dateTime={post.publishedAt}>{date}</time>
        </p>
      )}
      {post.excerpt && <p className="text-muted-foreground mt-3 max-w-2xl leading-relaxed">{post.excerpt}</p>}
    </article>
  )
}

export function PostList({ posts, headingLevel }: { posts: PostCardData[]; headingLevel?: 'h2' | 'h3' | 'h4' }) {
  return (
    <ul className="divide-border border-border divide-y border-y">
      {posts.map((post) => (
        <li key={post._id}>
          <PostRow post={post} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  )
}

/**
 * A post as a compact card, for tight spaces like the home page's first
 * screen: meta line, title, and two lines of excerpt. One click target.
 * Featured posts lead their list and say so.
 */
export function PostCard({
  post,
  featuredLabel,
  headingLevel: Heading = 'h3',
}: {
  post: PostCardData & { pinned?: boolean }
  featuredLabel?: string
  headingLevel?: 'h3' | 'h4' | 'h5' | 'h6'
}) {
  const date = formatDate(post.publishedAt)
  const meta = [post.category, date].filter(Boolean).join(' · ')
  return (
    <article className="group bg-card border-border rounded-ui relative border p-5">
      <p className="text-muted-foreground text-xs">
        {post.pinned && featuredLabel && <span className="text-link mr-2 font-semibold tracking-[0.14em] uppercase">{featuredLabel}</span>}
        {meta}
      </p>
      <Heading className="mt-1.5 font-serif text-xl leading-snug font-semibold">
        <Link
          href={`/blog/${post.slug}`}
          className="group-hover:text-link visited:text-visited after:rounded-ui focus-visible:after:outline-ring after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2"
        >
          {post.title}
        </Link>
      </Heading>
      {post.excerpt && <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed">{post.excerpt}</p>}
    </article>
  )
}
