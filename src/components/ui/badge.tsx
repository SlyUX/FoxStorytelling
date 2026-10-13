import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * A small label: a book's status, a post's category. Variant names match
 * shadcn's, plus `ember` for things on their way. This file is ours: when the
 * CLI offers to overwrite it, say no.
 */
export const badgeVariants = cva('rounded-ui inline-flex w-fit items-center gap-1 border px-2 py-0.5 font-sans text-xs font-semibold whitespace-nowrap', {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground border-transparent',
      secondary: 'bg-secondary text-secondary-foreground border-transparent',
      outline: 'border-foreground/40 text-foreground',
      ember: 'border-ember/60 text-ember',
      destructive: 'border-destructive text-destructive',
    },
  },
  defaultVariants: { variant: 'secondary' },
})

export function Badge({ className, variant, ...props }: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
