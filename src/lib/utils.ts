import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Class names, merged so a later Tailwind class wins over an earlier one (shadcn's `cn`). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Guard a stored URL before using it as a link `href`: only http(s) and mailto
 * pass; anything else (e.g. a `javascript:` URL) returns undefined, so the
 * anchor renders without an href rather than as an executable link.
 */
export function externalHref(url: string | null | undefined): string | undefined {
  const value = (url ?? '').trim()
  return /^(https?:|mailto:)/i.test(value) ? value : undefined
}

/** "2026-10-12T…" → "October 12, 2026". Undefined for a missing or bad date. */
export function formatDate(value: string | null | undefined): string | undefined {
  if (!value) return undefined
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return undefined
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
}

/** Fill `{name}` placeholders in a CMS template, e.g. "Buy on {store}". */
export const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match)
