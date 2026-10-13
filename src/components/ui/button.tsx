import { TransitionLink } from '@/components/transition-link'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn, externalHref } from '@/lib/utils'
import type { CmsLink } from '@/lib/types'

/**
 * Buttons. Variant and size names match shadcn's, so components added with
 * `npx shadcn add` that import `buttonVariants` get these styles.
 * This file is ours: when the CLI offers to overwrite it, say no.
 *
 *  - default: the red action. One per view: the thing we most want done.
 *  - outline: bone edge on any ground. Everything else that's a button.
 *  - secondary: a quiet filled button, for toolbars and dense UI.
 *  - ghost: no edge until hovered. Menus and icon buttons.
 *  - link: ember text, for an action that reads like a link.
 *  - destructive: light red. Rare on a reader-facing site.
 */
export const buttonVariants = cva(
  'rounded-ui inline-flex shrink-0 items-center justify-center gap-2 border font-sans font-semibold whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/85 border-transparent',
        outline: 'border-foreground/60 text-foreground hover:border-link hover:text-link bg-transparent',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/70 border-transparent',
        ghost: 'hover:bg-accent hover:text-accent-foreground border-transparent bg-transparent',
        link: 'text-link h-auto border-transparent bg-transparent px-0 underline-offset-4 hover:underline',
        destructive: 'border-destructive text-destructive hover:bg-destructive/10 bg-transparent',
      },
      size: {
        default: 'h-11 px-5 text-sm',
        sm: 'h-9 px-3.5 text-sm',
        lg: 'h-12 px-7 text-base',
        icon: 'size-11',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

export type ButtonVariantProps = VariantProps<typeof buttonVariants>

export function Button({ className, variant, size, type = 'button', ...props }: React.ComponentProps<'button'> & ButtonVariantProps) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
}

/**
 * A link that looks like a button. Internal paths use next/link; full URLs
 * open in a new tab. Renders nothing when the address is missing or unsafe.
 */
export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
}: { href: string | null | undefined; className?: string; children: React.ReactNode } & ButtonVariantProps) {
  const cls = cn(buttonVariants({ variant, size }), className)
  if (href?.startsWith('/')) {
    return (
      <TransitionLink href={href} className={cls}>
        {children}
      </TransitionLink>
    )
  }
  const safe = externalHref(href)
  if (!safe) return null
  return (
    <a href={safe} className={cls} {...(safe.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {children}
    </a>
  )
}

/** A CMS link (label + address) as a button. Renders nothing when either is unset. */
export function CmsButtonLink({ link, ...props }: { link: CmsLink | null | undefined; className?: string } & ButtonVariantProps) {
  if (!link?.href || !link.label) return null
  return (
    <ButtonLink href={link.href} {...props}>
      {link.label}
    </ButtonLink>
  )
}
