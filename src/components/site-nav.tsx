'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

import { TransitionLink } from '@/components/transition-link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { CmsLink } from '@/lib/types'

type NavLink = Pick<CmsLink, 'label' | 'href'>

/** A book or post page counts as its section. */
const isCurrent = (pathname: string, href: string) => href !== '/' && (pathname === href || pathname.startsWith(`${href}/`))

/**
 * The header's page links, and the social marks (`social`). Desktops list the
 * links after the logo and set the marks at the right edge; narrower screens
 * fold both into a menu that rolls down from under the header, full width
 * (`.menu-blind`), the marks beneath the links. The current section is ember
 * with `aria-current`, so it's announced as well as seen.
 *
 * The menu is a disclosure: its button says whether it's open; closed, the
 * list is hidden from focus and screen readers. Escape closes it and returns
 * focus to the button; choosing a page or pressing anywhere outside closes it
 * too.
 */
export function SiteNav({ links, label, social }: { links: NavLink[]; label: string; social?: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const wrapRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      close()
      buttonRef.current?.focus()
    }
    const onPointer = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) close()
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointer)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointer)
    }
  }, [open, close])

  const Icon = open ? X : Menu

  return (
    <>
      {/* Fills the row: the menu button pushes right on narrow screens; on desktops the links sit at its start. */}
      <nav aria-label={label} className="flex flex-1 items-center justify-end lg:justify-start">
        <ul className="hidden items-center gap-x-6 text-sm font-semibold lg:flex">
          {links.map(({ label, href }) => {
            const current = isCurrent(pathname, href)
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

        {/* Not positioned, so the list hangs from the header itself and spans its full width. */}
        <div ref={wrapRef} className="lg:hidden">
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={panelId}
            // a11y-only name; the button shows an icon.
            aria-label="Menu"
            className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'size-9', open && 'border-link text-link')}
          >
            <Icon aria-hidden />
          </button>
          {/* Always rendered so it can roll back up; closed, it's inert and hidden (see .menu-blind). */}
          <div id={panelId} data-open={open} inert={!open} className="menu-blind bg-chrome border-border absolute inset-x-0 top-full border-b px-4 pb-4 sm:px-6">
            <ul>
              {links.map(({ label, href }) => {
                const current = isCurrent(pathname, href)
                return (
                  <li key={href} className="border-border border-b last:border-b-0">
                    <TransitionLink
                      href={href}
                      onClick={close}
                      aria-current={current ? 'page' : undefined}
                      className={cn('hover:text-link font-heading block py-3.5 text-2xl font-semibold transition-colors', current ? 'text-link' : 'text-foreground')}
                    >
                      {label}
                    </TransitionLink>
                  </li>
                )
              })}
            </ul>
            {/* The marks pulled left by their padding, so the first lines up with the links. */}
            {social && (
              <div className="border-border border-t pt-3">
                <div className="-ml-2.5">{social}</div>
              </div>
            )}
          </div>
        </div>
      </nav>
      {/* Pulled right by the marks' padding, so the last one ends at the text's edge. */}
      {social && <div className="-mr-2.5 hidden lg:block">{social}</div>}
    </>
  )
}
