import { FoxBadge } from '@/components/fox-badge'
import { cn } from '@/lib/utils'

/**
 * The logo: the fox badge beside the name, set in type as the brand draws it,
 * FOX in Montserrat Black and STORYTELLING in Montserrat Regular, run together
 * in capitals. Type rather than an image, so it's sharp at any size. The
 * letters are hidden from screen readers; the link around the logo carries the
 * site title as its name, so they hear "Fox Storytelling".
 */
export function SiteLogo({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <FoxBadge className="size-8 sm:size-9" />
      {/* The logo's letters: brand, not CMS copy. */}
      <span aria-hidden className="font-brand text-lg leading-none uppercase sm:text-xl">
        <span className="font-black">Fox</span>
        <span className="font-normal">storytelling</span>
      </span>
    </span>
  )
}
