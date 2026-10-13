import type { Metadata } from 'next'
import { Crimson_Pro, Geist, Montserrat } from 'next/font/google'

import './globals.css'
import { getSiteSettings } from '@/lib/site-settings'
import { cn } from '@/lib/utils'

// The interface: nav, buttons, labels, meta lines.
const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
// Reading and display: titles and long-form prose. Sturdy enough at text
// sizes that its strokes hold up as light type on a dark ground.
const crimson = Crimson_Pro({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-crimson' })
// The logo's letters only (see SiteLogo): the brand's typeface.
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' })

/**
 * Root layout stays minimal so the Studio at /studio is full-screen. Site
 * chrome lives in `(site)/layout.tsx`. Metadata comes from Sanity.
 */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return {
    title: { default: settings.title, template: `%s · ${settings.title}` },
    description: settings.seoDescription,
    openGraph: { title: settings.title, description: settings.seoDescription, siteName: settings.title, type: 'website' },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // `dark`: the site is always dark (see globals.css).
    <html lang="en" className={cn('dark', geist.variable, crimson.variable, montserrat.variable)}>
      <body className="bg-background text-foreground min-h-screen font-sans antialiased">{children}</body>
    </html>
  )
}
