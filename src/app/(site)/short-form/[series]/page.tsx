import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PostList } from '@/components/post-list'
import { TransitionLink } from '@/components/transition-link'
import { EmptyState, PageHeader, Section } from '@/components/ui/section'
import { SERIES_QUERY, safeFetch } from '@/lib/queries'
import { getSiteSettings } from '@/lib/site-settings'
import type { SeriesDetail } from '@/lib/types'

type Props = { params: Promise<{ series: string }> }

const getSeries = (series: string) => safeFetch<SeriesDetail | null>(SERIES_QUERY, { series }, null)

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const series = await getSeries((await params).series)
  return series ? { title: series.title, description: series.intro } : {}
}

/** A series: its title and intro, under a link back to Short Form, then all its posts, newest first. */
export default async function SeriesPage({ params }: Props) {
  const [settings, series] = await Promise.all([getSiteSettings(), getSeries((await params).series)])
  if (!series) notFound()
  return (
    <Section opener>
      <PageHeader
        title={series.title}
        intro={series.intro}
        eyebrow={
          <TransitionLink href="/short-form" className="underline-offset-4 hover:underline">
            {settings.shortFormTitle}
          </TransitionLink>
        }
      />
      <div className="mt-10">{series.posts.length ? <PostList posts={series.posts} showSeries={false} headingLevel="h2" /> : <EmptyState>{settings.postsEmpty}</EmptyState>}</div>
    </Section>
  )
}
