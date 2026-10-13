'use client'

import { usePathname } from 'next/navigation'
import { ViewTransition } from 'react'

/**
 * Transition type → CSS class, per side, in `globals.css`. The entering and
 * leaving pages get different classes, so whichever one moves can sit on top.
 */
const ENTER = { 'page-rise': 'page-rise-in', 'page-lower': 'page-lower-in', default: 'none' }
const EXIT = { 'page-rise': 'page-rise-out', 'page-lower': 'page-lower-out', default: 'none' }

/**
 * Wraps each page (main and the footer, see template.tsx) so every navigation
 * is an exit and an enter for the view transition to animate. Keyed by the
 * full pathname: a template only remounts when its own segment changes, so
 * /books → /books/scar-tissue would otherwise never exit or enter.
 *
 * Opaque, so a moving page never shows the one behind it; it fills the height
 * the header leaves, so even a short page moves as a full panel. Types come
 * from TransitionLink; a first load, browser back and forward carry none, and
 * don't animate.
 */
export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <ViewTransition key={pathname} enter={ENTER} exit={EXIT} default="none">
      <div className="bg-background flex flex-1 flex-col">{children}</div>
    </ViewTransition>
  )
}
