import { siBluesky, siFacebook, siInstagram, siYoutube } from 'simple-icons'

import type { SiteSettings } from '@/lib/site-settings'
import { cn, externalHref } from '@/lib/utils'

type SocialLink = NonNullable<SiteSettings['socials']>[number]

/**
 * Every platform the Studio offers (socialLink.ts), with its mark: a Simple
 * Icons path, or a file used as a stencil, for ND Riot's lockup (too detailed
 * to inline twice per page; the file is theirs, unaltered, in /public).
 */
type Mark = { title: string; path: string } | { title: string; src: string; className: string }
const MARKS: Record<SocialLink['platform'], Mark> = {
  'ND Riot': { title: 'ND Riot', src: '/nd-riot-logo.svg', className: 'h-7 w-11' },
  Instagram: siInstagram,
  Facebook: siFacebook,
  YouTube: siYoutube,
  Bluesky: siBluesky,
}

/**
 * The site's social profiles, and ND Riot, as marks: each drawn in the text's
 * color rather than the brand's own, so they sit quietly in the palette and
 * turn ember on hover. Each opens in a new tab. A mark says nothing to a
 * screen reader, so the platform's name is read instead. Targets are 40px
 * tall, with 10px either side of the mark; callers pull them out by that much
 * so the marks line up with the text's edges.
 */
export function SocialLinks({ links, className }: { links: SiteSettings['socials']; className?: string }) {
  const shown = (links ?? []).filter((link) => MARKS[link.platform] && externalHref(link.url))
  if (!shown.length) return null
  return (
    <ul className={cn('flex flex-wrap items-center', className)}>
      {shown.map((link) => {
        const mark = MARKS[link.platform]
        return (
          <li key={link._key}>
            <a href={externalHref(link.url)} target="_blank" rel="noopener noreferrer" className="hover:text-link rounded-ui flex h-10 items-center justify-center px-2.5 transition-colors">
              {'path' in mark ? (
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-5">
                  <path d={mark.path} />
                </svg>
              ) : (
                <span aria-hidden className={cn('block bg-current', mark.className)} style={{ mask: `url(${mark.src}) center / contain no-repeat`, WebkitMask: `url(${mark.src}) center / contain no-repeat` }} />
              )}
              <span className="sr-only">{mark.title}</span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}
