import { HeaderHeight } from '@/components/header-height'
import { SiteLogo } from '@/components/site-logo'
import { SiteNav } from '@/components/site-nav'
import { TransitionLink } from '@/components/transition-link'
import { getSiteSettings } from '@/lib/site-settings'

/**
 * Pages are static but refresh from Sanity at most once a minute, so edits in
 * the Studio go live without a redeploy. New slugs render on first request.
 */
export const revalidate = 60

/** Site chrome: skip link and header, which holds still while pages move beneath it. Main and the footer are in the page template (template.tsx). Kept off the full-screen Studio. */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()
  return (
    <div className="flex min-h-svh flex-col">
      <a href="#main" className="bg-primary text-primary-foreground sr-only z-50 px-4 py-2 focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
        {/* a11y-only text; not CMS-managed. */}
        Skip to content
      </a>
      {/* Named for view transitions, so it holds still while pages rise and lower beneath it. */}
      <header data-site-header className="border-border bg-background relative z-40 border-b px-4 sm:px-6" style={{ viewTransitionName: 'site-header' }}>
        <HeaderHeight />
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-3 py-4">
          <TransitionLink href="/" aria-label={settings.title} className="shrink-0">
            <SiteLogo />
          </TransitionLink>
          {/* aria-label is a11y-only text, not CMS copy. */}
          <SiteNav links={settings.navigation} label="Main" />
        </div>
      </header>
      {children}
    </div>
  )
}
