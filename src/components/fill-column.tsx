'use client'

import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

/**
 * Shows only what fits, on `split:` screens. There it steps aside
 * (`display: contents`), so its items join its parent's column: a fixed-height
 * column that wraps, clipping what doesn't fit into a second column out of
 * view, so none is ever cut in half. CSS does the fitting, so it's right
 * before any script runs and as the window resizes; this marks the clipped
 * items inert, so keyboard focus and screen readers skip what can't be seen.
 * Stacked, it's a plain column and everything flows.
 *
 * Put the gap between items on the items (margins): the parent's column gap
 * keeps wrapped items clear of the visible column.
 */
export function FillColumn({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const box = ref.current
    if (!box) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) (entry.target as HTMLElement).inert = !entry.isIntersecting
      },
      // The parent holds the column (FillColumn has no box of its own on split screens).
      { root: box.parentElement },
    )
    for (const item of box.children) observer.observe(item)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={cn('split:contents flex flex-col px-6 pb-12 sm:px-10', className)}>
      {children}
    </div>
  )
}
