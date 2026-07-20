import Link from 'next/link'
import Newsletter from '@/components/Newsletter'
import { safeFetch, BOOKS_QUERY, POSTS_QUERY, FEATURED_QUERY } from '@/lib/queries'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const featured = await safeFetch<any>(FEATURED_QUERY, {}, null)
  const books = await safeFetch<any[]>(BOOKS_QUERY, {}, [])
  const posts = await safeFetch<any[]>(POSTS_QUERY, {}, [])

  return (
    <div className="space-y-16">
      <section className="py-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Redemptive horror.</h1>
        <p className="mt-4 max-w-xl text-neutral-400">Dark stories with a soul — books and comics by Stephen Fox.</p>
      </section>

      {featured && (
        <section>
          <p className="text-xs uppercase tracking-widest text-neutral-500">Featured</p>
          <Link href={`/blog/${featured.slug}`} className="mt-2 block text-2xl font-semibold hover:underline">
            {featured.title}
          </Link>
          <p className="mt-2 text-neutral-400">{featured.excerpt}</p>
        </section>
      )}

      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">Books</h2>
          <Link href="/books" className="text-sm text-neutral-400 hover:text-white">View all →</Link>
        </div>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {books.slice(0, 4).map((b) => (
            <li key={b._id} className="rounded-lg border border-neutral-800 p-4">
              <Link href={`/books/${b.slug}`} className="font-medium hover:underline">{b.title}</Link>
              <p className="text-sm text-neutral-500">{b.series} · {b.status}</p>
            </li>
          ))}
          {!books.length && <li className="text-sm text-neutral-500">No books yet — add one in the Studio.</li>}
        </ul>
      </section>

      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">Latest from the Rejection Files</h2>
          <Link href="/blog" className="text-sm text-neutral-400 hover:text-white">View all →</Link>
        </div>
        <ul className="mt-4 space-y-3">
          {posts.slice(0, 5).map((p) => (
            <li key={p._id}>
              <Link href={`/blog/${p.slug}`} className="hover:underline">{p.title}</Link>
              <span className="ml-2 text-xs text-neutral-500">{p.category}</span>
            </li>
          ))}
          {!posts.length && <li className="text-sm text-neutral-500">No posts yet — write one in the Studio.</li>}
        </ul>
      </section>

      <Newsletter />
    </div>
  )
}
