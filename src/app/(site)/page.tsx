import { HomeSplit } from '@/components/home-split'
import { Newsletter } from '@/components/newsletter'
import { Section } from '@/components/ui/section'
import { BOOKS_QUERY, HOME_POSTS_QUERY, HOME_SPOTLIGHT_QUERY, PAGE_QUERY, safeFetch } from '@/lib/queries'
import { getSiteSettings } from '@/lib/site-settings'
import type { BookCardData, HomePost, PageDetail, SpotlightBook } from '@/lib/types'

export default async function Home() {
  const [settings, books, posts, spotlight, about] = await Promise.all([
    getSiteSettings(),
    safeFetch<BookCardData[]>(BOOKS_QUERY, {}, []),
    safeFetch<HomePost[]>(HOME_POSTS_QUERY, {}, []),
    safeFetch<SpotlightBook[]>(HOME_SPOTLIGHT_QUERY, {}, []),
    safeFetch<PageDetail | null>(PAGE_QUERY, { slug: 'about' }, null),
  ])

  return (
    <>
      <HomeSplit settings={settings} spotlight={spotlight} fallbackBook={books[0] ?? null} posts={posts} aboutExists={!!about} preload />

      {settings.newsletterUrl && (
        <Section>
          <Newsletter settings={settings} />
        </Section>
      )}
    </>
  )
}
