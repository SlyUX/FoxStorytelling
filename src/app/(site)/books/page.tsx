import Link from 'next/link'
import { safeFetch, BOOKS_QUERY } from '@/lib/queries'
export const dynamic = 'force-dynamic'
export default async function BooksPage() {
  const books = await safeFetch<any[]>(BOOKS_QUERY, {}, [])
  return (
    <div>
      <h1 className="text-3xl font-bold">Books</h1>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {books.map((b) => (
          <li key={b._id} className="rounded-lg border border-neutral-800 p-4">
            <Link href={`/books/${b.slug}`} className="font-medium hover:underline">{b.title}</Link>
            <p className="text-sm text-neutral-500">{b.series} · {b.status}</p>
            {b.shortDescription && <p className="mt-2 text-sm text-neutral-400">{b.shortDescription}</p>}
          </li>
        ))}
        {!books.length && <li className="text-sm text-neutral-500">No books yet.</li>}
      </ul>
    </div>
  )
}
