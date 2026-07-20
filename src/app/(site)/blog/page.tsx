import Link from 'next/link'
import { safeFetch, POSTS_QUERY } from '@/lib/queries'
export const dynamic = 'force-dynamic'
export default async function BlogPage() {
  const posts = await safeFetch<any[]>(POSTS_QUERY, {}, [])
  return (
    <div>
      <h1 className="text-3xl font-bold">The Rejection Files</h1>
      <ul className="mt-6 space-y-4">
        {posts.map((p) => (
          <li key={p._id} className="border-b border-neutral-800 pb-4">
            <Link href={`/blog/${p.slug}`} className="text-lg font-medium hover:underline">{p.title}</Link>
            <p className="text-xs uppercase tracking-widest text-neutral-500">{p.category}</p>
            {p.excerpt && <p className="mt-1 text-sm text-neutral-400">{p.excerpt}</p>}
          </li>
        ))}
        {!posts.length && <li className="text-sm text-neutral-500">No posts yet.</li>}
      </ul>
    </div>
  )
}
