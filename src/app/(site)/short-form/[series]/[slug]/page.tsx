import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PostBecame } from '@/components/post-became'
import { RichText } from '@/components/rich-text'
import { Screenplay } from '@/components/screenplay'
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

/** A part of a Rejection File's link: to its page, under its own series. */
const partHref = (part: { slug: string; series: string }) => `/short-form/${part.series}/${part.slug}`

/**
 * A post, under its series' name (a link to the series), set by the series' form: comics run wide, the rest at
 * reading width. A Rejection File adds, after the body (the story): what it became; the pitch itself, and a script,
 * each a document of its own in a band below. In parts, each part links to the other: "Previously" under the
 * title, "Continued in" at the end.
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
          {post.follows?.slug && post.follows.series && (
            <p className="text-muted-foreground mt-2 text-sm">
              {settings.followsLabel}:{' '}
              <TransitionLink href={partHref({ slug: post.follows.slug, series: post.follows.series })} className="text-link underline underline-offset-4">
                {post.follows.title}
              </TransitionLink>
            </p>
          )}
        </PageHeader>
        {post.body?.length ? (
          <div className="mt-10">
            <RichText value={post.body} form={post.series.form} />
          </div>
        ) : null}
        <PostBecame became={post.became} heading={settings.becameHeading} linkLabel={settings.bookDetailsLabel} buyLabel={settings.buyLabel} className="mt-14" />
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
      {post.script?.length ? (
        // A band of its own; on night when it follows the pitch's band, so the two stay distinct.
        <Section tone={post.pitch?.length ? 'default' : 'surface'} width="prose" aria-labelledby="script-heading">
          <h2 id="script-heading" className="font-heading text-3xl leading-tight font-semibold">
            {settings.scriptHeading}
          </h2>
          <Screenplay value={post.script} className="mt-8" />
        </Section>
      ) : null}
      {post.continuedIn?.slug && post.continuedIn.series && (
        <Section width="prose">
          <p className="text-muted-foreground text-sm">{settings.continuedLabel}</p>
          <p className="font-display mt-2 text-3xl leading-tight">
            <TransitionLink href={partHref({ slug: post.continuedIn.slug, series: post.continuedIn.series })} className="hover:text-link">
              {post.continuedIn.title}
            </TransitionLink>
          </p>
        </Section>
      )}
    </article>
  )
}
