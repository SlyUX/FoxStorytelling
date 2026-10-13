'use client'

import { useEffect } from 'react'

/**
 * Publishes the site header's height as --header-h (globals.css has the built
 * default), so the home page's split fills exactly the rest of the first
 * screen, even when the nav wraps to a second line on phones.
 */
export function HeaderHeight() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>('[data-site-header]')
    if (!header) return
    const observer = new ResizeObserver(([entry]) =>
      document.documentElement.style.setProperty('--header-h', `${Math.round(entry.borderBoxSize[0].blockSize)}px`),
    )
    observer.observe(header)
    return () => observer.disconnect()
  }, [])

  return null
}
