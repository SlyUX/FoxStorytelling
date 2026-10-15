import type { Metadata } from 'next'

import { PostCard } from '@/components/post-list'
import { ButtonLink } from '@/components/ui/button'
import { EmptyState, PageHeader, Section, SectionHeading } from '@/components/ui/section'
import { SERIES_LIST_QUERY, safeFetch } from '@/lib/queries'
import { getSiteSettings } from '@/lib/site-settings'
import type { SeriesSummary } from '@/lib/types'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return { title: settings.shortFormTitle, description: settings.shortFormIntro }
}

/**
 * Short Form: every series in its order (Studio → Short Form → Series), each
 * on its own band with its newest posts and a link to the rest. A series
 * stays off this page until it has a post.
 */
export default async function ShortFormPage() {
  const [settings, series] = await Promise.all([getSiteSettings(), safeFetch<SeriesSummary[]>(SERIES_LIST_QUERY, {}, [])])
  const shown = series.filter((s) => s.posts.length)
  return (
    <>
      <Section opener>
        <PageHeader title={settings.shortFormTitle} intro={settings.shortFormIntro} />
        {!shown.length && (
          <div className="mt-10">
            <EmptyState>{settings.postsEmpty}</EmptyState>
          </div>
        )}
      </Section>
      {shown.map((s, i) => (
        <Section key={s._id} tone={i % 2 ? 'default' : 'surface'} aria-labelledby={`series-${s.slug}`}>
          <SectionHeading
            id={`series-${s.slug}`}
            intro={s.intro}
            action={
              <ButtonLink href={`/short-form/${s.slug}`} variant="link">
                {settings.viewAllLabel}
              </ButtonLink>
            }
          >
            {s.title}
          </SectionHeading>
          <div className="grid gap-3 lg:grid-cols-2">
            {s.posts.map((post) => (
              <PostCard key={post._id} post={post} showSeries={false} headingLevel="h3" />
            ))}
          </div>
        </Section>
      ))}
    </>
  )
}
