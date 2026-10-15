/**
 * Slugs are lowercase letters, numbers, and single hyphens. Next.js routes are
 * case-sensitive, so a stray capital is a silent broken link: a page saved as
 * "About" exists at /About, while every link points to /about. (It happened.)
 */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/**
 * Text → slug: lowercase; accents and apostrophes dropped ("Sanguiné" →
 * "sanguine", "Rae's" → "raes"); anything else that isn't a letter or number
 * becomes a gap; gaps collapse to single hyphens. `final` also trims hyphens
 * from the ends. The input leaves them while you type, or it would delete the
 * hyphen the moment you typed it.
 *
 * The accent and apostrophe ranges are written as escapes, not literal
 * characters: combining marks are invisible in source and easy to break.
 * Letters with no decomposed form ("Æ") fall to the filter that follows.
 */
export function toSlug(input: string, { final = true }: { final?: boolean } = {}): string {
  const slug = input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['\u2019]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/[\s-]+/g, '-')
  return (final ? slug.replace(/^-+|-+$/g, '') : slug).slice(0, 96)
}
