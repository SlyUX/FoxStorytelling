import { defineField } from 'sanity'

import { LowercaseSlugInput } from '../components/LowercaseSlugInput'
import { SLUG_PATTERN, toSlug } from '../slug'

/**
 * The one slug field every routed type uses, so they all follow the same
 * rules (see `../slug.ts`). Two layers, because one isn't enough: Generate and
 * typing are normalized as they happen; validation refuses anything else that
 * reaches the field (a paste, an import, the API) and says what to use instead.
 */
export function slugField(source: string, routeExample: string) {
  return defineField({
    name: 'slug',
    title: 'Slug',
    type: 'slug',
    description: `The address: ${routeExample}. Click Generate, or type it: capitals and punctuation convert as you type, because addresses are case-sensitive and a stray capital breaks every link to the page.`,
    options: { source, slugify: (input: string) => toSlug(input) },
    components: { input: LowercaseSlugInput },
    validation: (rule) =>
      rule.required().custom((value) => {
        const current = value?.current
        if (!current) return 'A slug is required.'
        return SLUG_PATTERN.test(current) ? true : `"${current}" won’t work as an address. Use lowercase letters, numbers, and single hyphens: "${toSlug(current)}".`
      }),
  })
}
