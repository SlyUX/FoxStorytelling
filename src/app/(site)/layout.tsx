import Link from 'next/link'

import { HeaderHeight } from '@/components/header-height'
import { SiteFooter } from '@/components/site-footer'
import { SiteLogo } from '@/components/site-logo'
import { SiteNav } from '@/components/site-nav'
import { getSiteSettings } from '@/lib/site-settings'

/**
 * Pages are static but refresh from Sanity at most once a minute, so edits in
 * the Studio go live without a redeploy. New slugs render on first request.
 */
export const revalidate = 60

/** Site chrome: skip link, header, footer. Kept off the full-screen Studio. */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()
  return (
    <div className="flex min-h-svh flex-col">
      <a href="#main" className="bg-primary text-primary-foreground sr-only z-50 px-4 py-2 focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
        {/* a11y-only text; not CMS-managed. */}
        Skip to content
      </a>
      <header data-site-header className="border-border border-b px-4 sm:px-6">
        <HeaderHeight />
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-3 py-4">
          <Link href="/" aria-label={settings.title} className="shrink-0">
            <SiteLogo />
          </Link>
          {/* aria-label is a11y-only text, not CMS copy. */}
          <SiteNav links={settings.navigation} label="Main" />
        </div>
      </header>
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter settings={settings} />
    </div>
  )
}
