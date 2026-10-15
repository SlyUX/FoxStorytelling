import { ExternalLink } from 'lucide-react'

import { ButtonLink } from '@/components/ui/button'
import { fill } from '@/lib/utils'
import type { CmsBuyLink } from '@/lib/types'

/**
 * Where to buy a book. The site never sells: every link hands off to a
 * retailer in a new tab. The first store is the red action; the rest are
 * outlined, so there's one clear choice. Where another red button already
 * leads the view (All stories, on Home), the first store is ember instead.
 */
/** The name on a store's button: the store's own, or the name given to another store (its web address until it has one). */
function storeName(link: CmsBuyLink): string {
  if (link.store !== 'Other') return link.store
  if (link.storeName?.trim()) return link.storeName.trim()
  try {
    return new URL(link.url).hostname.replace(/^www\./, '')
  } catch {
    return link.url
  }
}

export function BuyLinks({ links, label, lead = 'default' }: { links: CmsBuyLink[] | null | undefined; label: string; lead?: 'default' | 'ember' }) {
  if (!links?.length) return null
  return (
    <ul className="flex flex-wrap gap-3">
      {links.map((link, i) => (
        <li key={link._key}>
          <ButtonLink href={link.url} variant={i === 0 ? lead : 'outline'}>
            {fill(label, { store: storeName(link) })}
            <ExternalLink aria-hidden />
          </ButtonLink>
        </li>
      ))}
    </ul>
  )
}
