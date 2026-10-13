import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { RichText } from '@/components/rich-text'
import { PageHeader, Section } from '@/components/ui/section'
import { POST_QUERY, safeFetch } from '@/lib/queries'
import { formatDate } from '@/lib/utils'
import type { PostDetail } from '@/lib/types'

type Props = { params: Promise<{ slug: string }> }

const getPost = (slug: string) => safeFetch<PostDetail | null>(POST_QUERY, { slug }, null)

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug)
  return post ? { title: post.title, description: post.excerpt } : {}
}

export default async function PostPage({ params }: Props) {
  const post = await getPost((await params).slug)
  if (!post) notFound()
  const date = formatDate(post.publishedAt)

  return (
    <Section opener width="prose">
      <article>
        <PageHeader title={post.title} eyebrow={post.category}>
          {date && (
            <p className="text-muted-foreground mt-4 text-sm">
              <time dateTime={post.publishedAt}>{date}</time>
            </p>
          )}
        </PageHeader>
        <div className="mt-10">
          <RichText value={post.body} />
        </div>
      </article>
    </Section>
  )
}
