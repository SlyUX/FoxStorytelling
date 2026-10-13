'use client'

import { useState, useSyncExternalStore } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'

import { BreathingArt } from '@/components/breathing-art'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type SpotlightSlide = {
  key: string
  /** The book's title, for the controls' labels. */
  title: string
  /** The art's hotspot, as a CSS position. */
  focus: string
  /** The cloud's color over this art (hex), if the Studio picked one. */
  cloud?: string | null
  /** Whether the cloud shows over this art; on unless a book turns it off. */
  cloudOn?: boolean
  art: React.ReactNode
  details: React.ReactNode
}

const REDUCE = '(prefers-reduced-motion: reduce)'
const subscribeReduce = (onChange: () => void) => {
  const query = window.matchMedia(REDUCE)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

/**
 * The home page's first screen: books' art breathing on one side, the showing
 * book's details over its foot; on the other, the site's description and what
 * follows (`column`). Two columns exactly filling the screen under the header
 * on landscape screens from tablet width (`split:`); stacked below that, the
 * art takes most of the first screen.
 *
 * The breath is the clock: as each breath ends, with the art settled and at its
 * dimmest, the next book crossfades in, so there's never a hard cut. The
 * rotation holds while the pointer or keyboard focus is anywhere on the art,
 * so a buy button never changes under someone reading it; pause stops it outright;
 * reduced motion never advances on its own. Previous, next, and a marker per
 * book step through by hand. With one slide, it's just the art and details.
 */
export function BookSpotlight({
  slides,
  column,
  label,
  className,
}: {
  slides: SpotlightSlide[]
  /** The other column's content: the description and what follows it. */
  column: React.ReactNode
  /** What the rotation is, for screen readers. */
  label: string
  className?: string
}) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hover, setHover] = useState(false)
  const [focusWithin, setFocusWithin] = useState(false)
  const reduce = useSyncExternalStore(
    subscribeReduce,
    () => window.matchMedia(REDUCE).matches,
    () => false,
  )

  const many = slides.length > 1
  const hasDetails = slides.some((slide) => slide.details)
  const rotating = many && !paused && !hover && !focusWithin && !reduce
  const go = (i: number) => setIndex((i + slides.length) % slides.length)
  const current = slides[index] ?? slides[0]
  const iconButton = cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'bg-background/60 text-foreground/80 hover:text-link size-9')

  return (
    <div className={cn('split:grid-cols-2 split:h-[calc(100svh-var(--header-h))] grid', className)}>
      {/* First in reading order, so the page's h1 comes first; the art is placed before it on screen. */}
      <div className="split:min-h-0 split:px-12 split:py-10 flex flex-col px-6 py-12 sm:px-10 lg:px-16">{column}</div>

      <section
        // a11y-only text; not CMS-managed.
        aria-roledescription={many ? 'carousel' : undefined}
        aria-label={many ? label : undefined}
        className="grid order-first"
        onPointerEnter={(event) => event.pointerType === 'mouse' && setHover(true)}
        onPointerLeave={(event) => event.pointerType === 'mouse' && setHover(false)}
        onFocus={() => setFocusWithin(true)}
        onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setFocusWithin(false)}
      >
        <BreathingArt
          focus={current.focus}
          cloud={current.cloud}
          cloudOn={current.cloudOn ?? true}
          paused={paused}
          onBreath={() => rotating && go(index + 1)}
          // Stacked, the art takes most of the first screen, so the book over it still leaves the art room.
          className="split:min-h-0 min-h-[calc((100svh-var(--header-h))*0.7)]"
          art={slides.map((slide, i) => (
            <div key={slide.key} aria-hidden={i !== index} className={cn('absolute inset-0 transition-opacity duration-2000 ease-in-out', i === index ? 'opacity-100' : 'opacity-0')}>
              {slide.art}
            </div>
          ))}
          controls={
            <>
              {/* Labels on these controls are a11y-only text; not CMS-managed. */}
              <button type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Play animation' : 'Pause animation'} className={cn(iconButton, 'motion-reduce:hidden')}>
                {paused ? <Play aria-hidden /> : <Pause aria-hidden />}
              </button>
              {many && (
                <>
                  <button type="button" onClick={() => go(index - 1)} aria-label="Previous book" className={iconButton}>
                    <ChevronLeft aria-hidden />
                  </button>
                  <span className="bg-background/60 rounded-ui flex h-9 items-center px-1">
                    {slides.map((slide, i) => (
                      <button
                        key={slide.key}
                        type="button"
                        onClick={() => go(i)}
                        aria-label={`Show ${slide.title}`}
                        aria-current={i === index ? 'true' : undefined}
                        className="group grid size-7 place-items-center"
                      >
                        <span className={cn('rounded-ui h-1 w-4 transition-colors', i === index ? 'bg-foreground' : 'bg-foreground/50 group-hover:bg-foreground/80')} />
                      </button>
                    ))}
                  </span>
                  <button type="button" onClick={() => go(index + 1)} aria-label="Next book" className={iconButton}>
                    <ChevronRight aria-hidden />
                  </button>
                </>
              )}
            </>
          }
          overlay={
            hasDetails && (
              // The book sits on night at 85%, so its text holds over any part of any image (see globals.css).
              <div>
                {/* A long fade into the band, so it reads as shadow, not a panel; shorter stacked, where the art has less room. */}
                <div aria-hidden className="from-background/85 split:h-40 h-24 bg-linear-to-t to-transparent" />
                <div className="bg-background/85 split:px-12 split:pb-12 px-6 pb-8 sm:px-10">
                  {/* Every book's details share one cell, so the overlay is as tall as the longest and nothing jumps as they change. */}
                  <div className="grid max-w-xl" aria-live={rotating ? 'off' : 'polite'}>
                    {slides.map((slide, i) => (
                      <div
                        key={slide.key}
                        {...(many
                          ? {
                              role: 'group',
                              'aria-roledescription': 'slide',
                              'aria-label': `${i + 1} of ${slides.length}`,
                            }
                          : {})}
                        inert={i !== index}
                        // One book's words leave before the next's arrive, so two titles never overlap.
                        className={cn('transition-opacity [grid-area:1/1]', i === index ? 'opacity-100 delay-300 duration-500' : 'opacity-0 duration-300')}
                      >
                        {slide.details}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          }
        />
      </section>
    </div>
  )
}
