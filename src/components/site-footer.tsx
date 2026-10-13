import type { SiteSettings } from '@/lib/site-settings'

export function SiteFooter({ settings }: { settings: Pick<SiteSettings, 'title'> }) {
  return (
    <footer className="border-border text-muted-foreground border-t px-4 py-10 text-sm sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p>
          © {new Date().getFullYear()} {settings.title}
        </p>
      </div>
    </footer>
  )
}
