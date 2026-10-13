import { BookCard, BookGrid } from '@/components/book-card'
import { HomeSplit } from '@/components/home-split'
import { Newsletter } from '@/components/newsletter'
import { EmptyState, Section, SectionHeading } from '@/components/ui/section'
import { BOOKS_QUERY, HOME_POSTS_QUERY, HOME_SPOTLIGHT_QUERY, PAGE_QUERY, safeFetch } from '@/lib/queries'
import { getSiteSettings } from '@/lib/site-settings'
import type { BookCardData, HomePost, PageDetail, SpotlightBook } from '@/lib/types'

export default async function Home() {
  const [settings, books, posts, spotlight, about] = await Promise.all([
    getSiteSettings(),
    safeFetch<BookCardData[]>(BOOKS_QUERY, {}, []),
    safeFetch<HomePost[]>(HOME_POSTS_QUERY, {}, []),
    safeFetch<SpotlightBook[]>(HOME_SPOTLIGHT_QUERY, {}, []),
    safeFetch<PageDetail | null>(PAGE_QUERY, { slug: 'about' }, null),
  ])

  return (
    <>
      {/* On wide screens the first screen holds still while the rest of the page slides up over it like a sheet, and back down to reveal it. */}
      <HomeSplit
        settings={settings}
        spotlight={spotlight}
        fallbackBook={books[0] ?? null}
        posts={posts}
        aboutExists={!!about}
        preload
        className="split:sticky split:top-0"
      />

      <div className="bg-background border-border relative z-10 border-t">
        <Section id="books" aria-labelledby="books-heading">
          <SectionHeading id="books-heading">{settings.booksTitle}</SectionHeading>
          {books.length ? (
            <BookGrid>
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </BookGrid>
          ) : (
            <EmptyState>{settings.booksEmpty}</EmptyState>
          )}
        </Section>

        {settings.newsletterUrl && (
          <Section>
            <Newsletter settings={settings} />
          </Section>
        )}
      </div>
    </>
  )
}
