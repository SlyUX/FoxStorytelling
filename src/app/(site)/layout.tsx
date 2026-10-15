import { HeaderHeight } from '@/components/header-height'
import { PaletteIndicator } from '@/components/palette-preview'
import { SocialLinks } from '@/components/social-links'
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
      {/* Sticky: pinned to the top as the page scrolls. Named for view transitions, so it holds still while pages rise and lower beneath it. */}
      {/* As wide as Home's split (max-w-page), with its margins inside, so the logo lines up with Home's left edge and the last social mark with its right. */}
      <header data-site-header className="border-border bg-chrome sticky top-0 z-40 border-b" style={{ viewTransitionName: 'site-header' }}>
        <HeaderHeight />
        <div className="max-w-page mx-auto flex items-center gap-x-10 px-4 py-4 sm:px-6 lg:px-12">
          <TransitionLink href="/" aria-label={settings.title} className="shrink-0">
            <SiteLogo />
          </TransitionLink>
          {/* aria-label is a11y-only text, not CMS copy. */}
          <SiteNav links={settings.navigation} label="Main" social={settings.socials?.length ? <SocialLinks links={settings.socials} /> : null} />
        </div>
      </header>
      {children}
      <PaletteIndicator />
    </div>
  )
}
