'use client'

import { TransitionLink } from '@/components/transition-link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import type { CmsLink } from '@/lib/types'

/**
 * The header's page links. The current section is ember with
 * `aria-current`, so it's announced as well as seen; a book or post page
 * counts as its section.
 */
export function SiteNav({ links, label }: { links: Pick<CmsLink, 'label' | 'href'>[]; label: string }) {
  const pathname = usePathname()
  return (
    <nav aria-label={label}>
      <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold">
        {links.map(({ label, href }) => {
          const current = href !== '/' && (pathname === href || pathname.startsWith(`${href}/`))
          return (
            <li key={href}>
              <TransitionLink
                href={href}
                aria-current={current ? 'page' : undefined}
                className={cn('decoration-fox underline-offset-8 transition-colors hover:underline hover:decoration-2', current ? 'text-link' : 'text-foreground')}
              >
                {label}
              </TransitionLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
