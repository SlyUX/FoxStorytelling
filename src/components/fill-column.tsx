'use client'

import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

/**
 * Shows only what fits, on `split:` screens: items that don't fit wrap into a
 * second column, clipped out of view, so none is ever cut in half. CSS does the
 * fitting, so it's right before any script runs and as the window resizes;
 * this marks the clipped items inert, so keyboard focus and screen readers
 * skip what can't be seen. Below `split:`, everything flows.
 *
 * Put the gap between items on the items (margins), not here: the container's
 * column gap keeps wrapped items clear of the visible column.
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
      { root: box },
    )
    for (const item of box.children) observer.observe(item)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={cn('split:min-h-0 split:flex-1 split:flex-wrap split:gap-x-16 split:overflow-hidden flex flex-col *:w-full', className)}>
      {children}
    </div>
  )
}
