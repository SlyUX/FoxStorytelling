import type { Metadata } from 'next'

import { BookCard, BookGrid } from '@/components/book-card'
import { EmptyState, PageHeader, Section } from '@/components/ui/section'
import { BOOKS_QUERY, safeFetch } from '@/lib/queries'
import { getSiteSettings } from '@/lib/site-settings'
import type { BookCardData } from '@/lib/types'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return { title: settings.booksTitle, description: settings.booksIntro }
}

export default async function BooksPage() {
  const [settings, books] = await Promise.all([getSiteSettings(), safeFetch<BookCardData[]>(BOOKS_QUERY, {}, [])])
  return (
    <Section opener>
      <PageHeader title={settings.booksTitle} intro={settings.booksIntro} />
      <div className="mt-12">
        {books.length ? (
          <BookGrid>
            {books.map((book) => (
              <BookCard key={book._id} book={book} headingLevel="h2" />
            ))}
          </BookGrid>
        ) : (
          <EmptyState>{settings.booksEmpty}</EmptyState>
        )}
      </div>
    </Section>
  )
}
