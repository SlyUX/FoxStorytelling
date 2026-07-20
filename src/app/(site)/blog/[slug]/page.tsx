import PortableTextBody from '@/components/PortableTextBody'
import { safeFetch, POST_QUERY } from '@/lib/queries'
export const dynamic = 'force-dynamic'
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await safeFetch<any>(POST_QUERY, { slug }, null)
  if (!post) return <p className="text-neutral-500">Not found.</p>
  return (
    <article className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-widest text-neutral-500">{post.category}</p>
        <h1 className="mt-1 text-3xl font-bold">{post.title}</h1>
      </header>
      <PortableTextBody value={post.body} />
    </article>
  )
}
