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
