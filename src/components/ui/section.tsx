import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * Page structure shared by every page. Presentational only: content arrives
 * as props.
 */

/**
 * Full-bleed band with a centered, width-limited column. Bands are 48px top
 * and bottom on phones, 64px on wider screens; a page's opening band starts
 * closer to the header (32px, then 40px). `width="prose"` narrows the column
 * to a comfortable reading measure.
 */
const sectionVariants = cva('px-4 py-12 sm:px-6 md:py-16', {
  variants: {
    opener: { true: 'pt-8 md:pt-10' },
    tone: {
      default: '',
      surface: 'bg-surface',
    },
  },
  defaultVariants: { tone: 'default' },
})

export function Section({
  tone,
  opener,
  width = 'wide',
  className,
  children,
  ...props
}: React.ComponentProps<'section'> & VariantProps<typeof sectionVariants> & { width?: 'wide' | 'prose' }) {
  return (
    <section className={cn(sectionVariants({ tone, opener }), className)} {...props}>
      <div className={cn('mx-auto w-full', width === 'prose' ? 'max-w-2xl' : 'max-w-6xl')}>{children}</div>
    </section>
  )
}

/** Title, with an optional eyebrow above and intro below, at the top of a page. The page's only <h1>. */
export function PageHeader({ title, eyebrow, intro, children }: { title: string; eyebrow?: React.ReactNode; intro?: string | null; children?: React.ReactNode }) {
  return (
    <header>
      {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
      <h1 className="font-serif text-4xl leading-tight font-semibold tracking-tight md:text-5xl">{title}</h1>
      {intro && <p className="text-muted-foreground mt-4 max-w-2xl text-lg leading-relaxed">{intro}</p>}
      {children}
    </header>
  )
}

/**
 * A section's heading, the same on every band and page: one size, and one
 * gap (40px) to the content. An intro can sit below it and an action (a
 * "See all" link) beside it.
 */
export function SectionHeading({
  id,
  intro,
  action,
  as: Heading = 'h2',
  children,
}: {
  id?: string
  intro?: React.ReactNode
  action?: React.ReactNode
  /** The level, for a heading nested inside another section (the styleguide's examples). */
  as?: 'h2' | 'h3' | 'h4'
  children: React.ReactNode
}) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div>
        <Heading id={id} className="font-serif text-3xl font-semibold">
          {children}
        </Heading>
        {intro && <p className="text-muted-foreground mt-2">{intro}</p>}
      </div>
      {action}
    </div>
  )
}

/** Small tracked capitals in ember, above a title: a category, a label. `as` a heading when it names a block. */
export function Eyebrow({ as: Tag = 'p', className, ...props }: React.ComponentProps<'p'> & { as?: 'p' | 'h2' | 'h3' | 'h4' | 'h5' }) {
  return <Tag className={cn('text-link font-sans text-xs font-semibold tracking-[0.14em] uppercase', className)} {...props} />
}

/** What a list says before it has anything in it. Every list needs one. */
export function EmptyState({ children }: { children: React.ReactNode }) {
  return <p className="text-muted-foreground border-border rounded-ui border border-dashed px-5 py-8 text-center">{children}</p>
}
