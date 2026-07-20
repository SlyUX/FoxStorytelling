import BuyLinks from '@/components/BuyLinks'
import PortableTextBody from '@/components/PortableTextBody'
import { safeFetch, BOOK_QUERY } from '@/lib/queries'
export const dynamic = 'force-dynamic'
export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const book = await safeFetch<any>(BOOK_QUERY, { slug }, null)
  if (!book) return <p className="text-neutral-500">Not found.</p>
  return (
    <article className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">{book.title}</h1>
        <p className="text-neutral-500">{book.series} · {book.status}</p>
      </header>
      <PortableTextBody value={book.description} />
      <BuyLinks links={book.buyLinks} />
    </article>
  )
}
