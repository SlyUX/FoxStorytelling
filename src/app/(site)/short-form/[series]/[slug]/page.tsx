import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { RichText } from '@/components/rich-text'
import { TransitionLink } from '@/components/transition-link'
import { PageHeader, Section } from '@/components/ui/section'
import { POST_QUERY, safeFetch } from '@/lib/queries'
import { formatDate } from '@/lib/utils'
import type { PostDetail } from '@/lib/types'

type Props = { params: Promise<{ series: string; slug: string }> }

const getPost = (series: string, slug: string) => safeFetch<PostDetail | null>(POST_QUERY, { series, slug }, null)

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { series, slug } = await params
  const post = await getPost(series, slug)
  return post ? { title: post.title, description: post.excerpt } : {}
}

/** A post, under its series' name (a link to the series), set by the series' form: comics run wide, the rest at reading width. */
export default async function PostPage({ params }: Props) {
  const { series, slug } = await params
  const post = await getPost(series, slug)
  if (!post) notFound()
  const date = formatDate(post.publishedAt)

  return (
    <Section opener width={post.series.form === 'comics' ? 'wide' : 'prose'}>
      <article>
        <PageHeader
          title={post.title}
          eyebrow={
            <TransitionLink href={`/short-form/${post.series.slug}`} className="underline-offset-4 hover:underline">
              {post.series.title}
            </TransitionLink>
          }
        >
          {date && (
            <p className="text-muted-foreground mt-4 text-sm">
              <time dateTime={post.publishedAt}>{date}</time>
            </p>
          )}
        </PageHeader>
        <div className="mt-10">
          <RichText value={post.body} form={post.series.form} />
        </div>
      </article>
    </Section>
  )
}
