import type { SiteSettings } from '@/lib/site-settings'

/** The copyright line, on black like the header, and as wide (max-w-page). */
export function SiteFooter({ settings }: { settings: Pick<SiteSettings, 'title'> }) {
  return (
    <footer className="border-border bg-chrome text-muted-foreground border-t py-10 text-sm">
      <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-12">
        <p>
          © {new Date().getFullYear()} {settings.title}
        </p>
      </div>
    </footer>
  )
}
