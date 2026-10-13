import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BookBadges, BookCover } from '@/components/book-card'
import { BuyLinks } from '@/components/buy-links'
import { RichText } from '@/components/rich-text'
import { PageHeader, Section } from '@/components/ui/section'
import { BOOK_QUERY, safeFetch } from '@/lib/queries'
import { getSiteSettings } from '@/lib/site-settings'
import type { BookDetail } from '@/lib/types'

type Props = { params: Promise<{ slug: string }> }

const getBook = (slug: string) => safeFetch<BookDetail | null>(BOOK_QUERY, { slug }, null)

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const book = await getBook((await params).slug)
  return book ? { title: book.title, description: book.shortDescription } : {}
}

export default async function BookPage({ params }: Props) {
  const { slug } = await params
  const [settings, book] = await Promise.all([getSiteSettings(), getBook(slug)])
  if (!book) notFound()

  return (
    <Section opener>
      <article className="grid gap-10 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:gap-14">
        <BookCover cover={book.cover} title={book.title} series={book.series} sizes="(max-width: 768px) 100vw, 320px" preload className="max-w-xs md:max-w-none" />
        <div className="flex flex-col gap-8">
          <PageHeader title={book.title} eyebrow={book.series} intro={book.shortDescription}>
            <div className="mt-5">
              <BookBadges status={book.status} format={book.format} />
            </div>
          </PageHeader>
          <BuyLinks links={book.buyLinks} label={settings.buyLabel} />
          <div className="max-w-2xl">
            <RichText value={book.description} />
          </div>
        </div>
      </article>
    </Section>
  )
}
