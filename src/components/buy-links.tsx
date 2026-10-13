import { ExternalLink } from 'lucide-react'

import { ButtonLink } from '@/components/ui/button'
import { fill } from '@/lib/utils'
import type { CmsBuyLink } from '@/lib/types'

/**
 * Where to buy a book. The site never sells: every link hands off to a
 * retailer in a new tab. The first store is the red action; the rest are
 * outlined, so there's one clear choice.
 */
export function BuyLinks({ links, label }: { links: CmsBuyLink[] | null | undefined; label: string }) {
  if (!links?.length) return null
  return (
    <ul className="flex flex-wrap gap-3">
      {links.map((link, i) => (
        <li key={link._key}>
          <ButtonLink href={link.url} variant={i === 0 ? 'default' : 'outline'}>
            {fill(label, { store: link.store })}
            <ExternalLink aria-hidden />
          </ButtonLink>
        </li>
      ))}
    </ul>
  )
}
