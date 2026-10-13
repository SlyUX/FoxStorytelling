import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { RichText } from '@/components/rich-text'
import { PageHeader, Section } from '@/components/ui/section'
import { PAGE_QUERY, safeFetch } from '@/lib/queries'
import type { PageDetail } from '@/lib/types'

/** Pages made in the Studio (About, and any others) render at /{slug}. */
type Props = { params: Promise<{ slug: string }> }

const getPage = (slug: string) => safeFetch<PageDetail | null>(PAGE_QUERY, { slug }, null)

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getPage((await params).slug)
  return page ? { title: page.title, description: page.intro } : {}
}

export default async function Page({ params }: Props) {
  const page = await getPage((await params).slug)
  if (!page) notFound()

  return (
    <Section opener width="prose">
      <PageHeader title={page.title} intro={page.intro} />
      <div className="mt-10">
        <RichText value={page.body} />
      </div>
    </Section>
  )
}
