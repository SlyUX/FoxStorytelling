import type { Metadata } from 'next'
import { Montserrat, Roboto, Special_Gothic_Condensed_One } from 'next/font/google'

import './globals.css'
import { PALETTE_SCRIPT } from '@/lib/palette-preview'
import { getSiteSettings } from '@/lib/site-settings'
import { cn } from '@/lib/utils'

// Everything but page titles and the logo: headings, reading, and the interface. Variable weight, with true italics.
const roboto = Roboto({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-roboto' })
// Titles: page titles (h1) in capitals, story titles in their own case. One weight, so never set bold (a browser would fake it).
const gothic = Special_Gothic_Condensed_One({ weight: '400', subsets: ['latin'], variable: '--font-special-gothic' })
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
    // suppressHydrationWarning: the palette preview sets data-palette on <html> before React loads (see below).
    <html lang="en" suppressHydrationWarning className={cn('dark', roboto.variable, gothic.variable, montserrat.variable)}>
      {/* Browser extensions (ColorZilla's cz-shortcut-listen, for one) add attributes to <body> before React
          loads. This silences that mismatch for <body>'s own attributes only; the page inside is still checked. */}
      <head>
        {/* The palette preview (lib/palette-preview.ts), first thing in <head>: it runs before the page paints, so a previewed
            palette never flashes the current one. (next/script's beforeInteractive runs later, before hydration.) */}
        <script dangerouslySetInnerHTML={{ __html: PALETTE_SCRIPT }} />
      </head>
      <body suppressHydrationWarning className="bg-background text-foreground min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
