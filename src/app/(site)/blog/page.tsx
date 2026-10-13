import type { Metadata } from 'next'

import { PostList } from '@/components/post-list'
import { EmptyState, PageHeader, Section } from '@/components/ui/section'
import { POSTS_QUERY, safeFetch } from '@/lib/queries'
import { getSiteSettings } from '@/lib/site-settings'
import type { PostCardData } from '@/lib/types'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return { title: settings.blogTitle, description: settings.blogIntro }
}

export default async function BlogPage() {
  const [settings, posts] = await Promise.all([getSiteSettings(), safeFetch<PostCardData[]>(POSTS_QUERY, {}, [])])
  return (
    <Section opener>
      <PageHeader title={settings.blogTitle} intro={settings.blogIntro} />
      <div className="mt-10">{posts.length ? <PostList posts={posts} headingLevel="h2" /> : <EmptyState>{settings.postsEmpty}</EmptyState>}</div>
    </Section>
  )
}
