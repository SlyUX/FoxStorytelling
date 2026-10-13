import { RouteTransition } from '@/components/route-transition'
import { SiteFooter } from '@/components/site-footer'
import { getSiteSettings } from '@/lib/site-settings'

/**
 * Main and the footer move together as one page between navigations (see
 * RouteTransition); the header, in the layout, holds still above them.
 */
export default async function SiteTemplate({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()
  return (
    <RouteTransition>
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter settings={settings} />
    </RouteTransition>
  )
}
