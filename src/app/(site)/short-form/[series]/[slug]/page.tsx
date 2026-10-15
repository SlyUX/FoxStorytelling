import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PostBecame } from '@/components/post-became'
import { RichText } from '@/components/rich-text'
import { TransitionLink } from '@/components/transition-link'
import { PageHeader, Section } from '@/components/ui/section'
import { POST_QUERY, safeFetch } from '@/lib/queries'
import { getSiteSettings } from '@/lib/site-settings'
import { formatDate } from '@/lib/utils'
import type { PostDetail } from '@/lib/types'

type Props = { params: Promise<{ series: string; slug: string }> }

const getPost = (series: string, slug: string) => safeFetch<PostDetail | null>(POST_QUERY, { series, slug }, null)

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { series, slug } = await params
  const post = await getPost(series, slug)
  return post ? { title: post.title, description: post.excerpt } : {}
}

/**
 * A post, under its series' name (a link to the series), set by the series' form: comics run wide, the rest at
 * reading width. A Rejection File adds two parts after the body (the story): what it became, and then the pitch
 * itself, as a document of its own in a band below.
 */
export default async function PostPage({ params }: Props) {
  const { series, slug } = await params
  const [settings, post] = await Promise.all([getSiteSettings(), getPost(series, slug)])
  if (!post) notFound()
  const date = formatDate(post.publishedAt)

  return (
    <article>
      <Section opener width={post.series.form === 'comics' ? 'wide' : 'prose'}>
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
        {post.body?.length ? (
          <div className="mt-10">
            <RichText value={post.body} form={post.series.form} />
          </div>
        ) : null}
        <PostBecame became={post.became} heading={settings.becameHeading} linkLabel={settings.bookDetailsLabel} className="mt-14" />
      </Section>
      {post.pitch?.length ? (
        <Section tone="surface" width="prose" aria-labelledby="pitch-heading">
          <h2 id="pitch-heading" className="font-heading text-3xl leading-tight font-semibold">
            {settings.pitchHeading}
          </h2>
          <div className="mt-8">
            <RichText value={post.pitch} nested />
          </div>
        </Section>
      ) : null}
    </article>
  )
}
