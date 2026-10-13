import Link from 'next/link'

import { BookCard, BookGrid } from '@/components/book-card'
import { HomeSplit } from '@/components/home-split'
import { Newsletter } from '@/components/newsletter'
import { PostList } from '@/components/post-list'
import { ButtonLink } from '@/components/ui/button'
import { EmptyState, Eyebrow, Section, SectionHeading } from '@/components/ui/section'
import { BOOKS_QUERY, FEATURED_POST_QUERY, HOME_SPOTLIGHT_QUERY, POSTS_QUERY, safeFetch } from '@/lib/queries'
import { getSiteSettings } from '@/lib/site-settings'
import { formatDate } from '@/lib/utils'
import type { BookCardData, FeaturedPost, PostCardData, SpotlightBook } from '@/lib/types'

export default async function Home() {
  const [settings, featured, books, posts, spotlight] = await Promise.all([
    getSiteSettings(),
    safeFetch<FeaturedPost>(FEATURED_POST_QUERY, {}, null),
    safeFetch<BookCardData[]>(BOOKS_QUERY, {}, []),
    safeFetch<PostCardData[]>(POSTS_QUERY, {}, []),
    safeFetch<SpotlightBook[]>(HOME_SPOTLIGHT_QUERY, {}, []),
  ])
  const featuredDate = formatDate(featured?.publishedAt)

  return (
    <>
      <HomeSplit settings={settings} spotlight={spotlight} fallbackBook={books[0] ?? null} preload />

      {featured && (
        <Section>
          <article className="group bg-card border-border rounded-ui relative border p-6 md:p-10">
            <Eyebrow className="mb-3">{settings.featuredLabel}</Eyebrow>
            <h2 className="font-serif text-3xl leading-tight font-semibold">
              <Link
                href={`/blog/${featured.slug}`}
                className="group-hover:text-link focus-visible:after:outline-ring after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2"
              >
                {featured.title}
              </Link>
            </h2>
            {featuredDate && (
              <p className="text-muted-foreground mt-2 text-sm">
                <time dateTime={featured.publishedAt}>{featuredDate}</time>
              </p>
            )}
            {featured.excerpt && <p className="text-muted-foreground mt-4 max-w-2xl text-lg leading-relaxed">{featured.excerpt}</p>}
          </article>
        </Section>
      )}

      <Section aria-labelledby="books-heading">
        <SectionHeading
          id="books-heading"
          action={
            books.length > 4 && (
              <ButtonLink href="/books" variant="outline" size="sm">
                {settings.viewAllLabel}
              </ButtonLink>
            )
          }
        >
          {settings.booksTitle}
        </SectionHeading>
        {books.length ? (
          <BookGrid>
            {books.slice(0, 4).map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </BookGrid>
        ) : (
          <EmptyState>{settings.booksEmpty}</EmptyState>
        )}
      </Section>

      <Section tone="surface" aria-labelledby="posts-heading">
        <SectionHeading
          id="posts-heading"
          action={
            posts.length > 5 && (
              <ButtonLink href="/blog" variant="outline" size="sm">
                {settings.viewAllLabel}
              </ButtonLink>
            )
          }
        >
          {settings.homePostsHeading}
        </SectionHeading>
        {posts.length ? <PostList posts={posts.slice(0, 5)} /> : <EmptyState>{settings.postsEmpty}</EmptyState>}
      </Section>

      {settings.newsletterUrl && (
        <Section>
          <Newsletter settings={settings} />
        </Section>
      )}
    </>
  )
}
