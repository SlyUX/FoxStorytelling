'use client'

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play, SlidersHorizontal } from 'lucide-react'

import { BreathingArt } from '@/components/breathing-art'
import { buttonVariants } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/section'
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
 * book's details over its foot; on the other, the site's description (`intro`)
 * and what follows it (`rest`), centered together. Two columns exactly filling
 * the screen under the header on landscape screens from tablet width
 * (`split:`). Stacked below that: the description, then the art, then the
 * rest. That's the reading order too, so keyboard and screen reader order
 * match the screen.
 *
 * The breath is the clock: as each breath ends, with the art settled and at its
 * dimmest, the next book crossfades in, so there's never a hard cut. The
 * rotation holds while the pointer or keyboard focus is anywhere on the art,
 * so a buy button never changes under someone reading it; pause stops it
 * outright; reduced motion never advances on its own. Previous, next, and a
 * marker per book step through by hand, tucked with pause behind one controls
 * toggle; so do the left and right arrow keys. With one slide, it's just the
 * art and details.
 */
export function BookSpotlight({
  slides,
  intro,
  rest,
  label,
  className,
}: {
  slides: SpotlightSlide[]
  /** The site's description: first on the page, beside the art on split screens. */
  intro: React.ReactNode
  /** What follows the description (a FillColumn): beside the art on split screens, below it stacked. */
  rest: React.ReactNode
  /** What the rotation is called: shown above the art on phones, and its name for screen readers everywhere. */
  label: string
  className?: string
}) {
  const [index, setIndex] = useState(0)
  // The point the breath swells from. It follows the showing book, but only as a breath ends, when the art is at
  // rest: moved mid-swell, the scaled art would jump (stepping by hand happens mid-swell).
  const [origin, setOrigin] = useState(slides[0]?.focus ?? '50% 40%')
  const [paused, setPaused] = useState(false)
  const [hover, setHover] = useState(false)
  const [focusWithin, setFocusWithin] = useState(false)
  const [controlsOpen, setControlsOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()
  const labelId = useId()
  const sectionRef = useRef<HTMLElement>(null)
  // Set when the arrow keys leave a book that had focus: its links go inert, so focus follows to the new one's.
  const refocus = useRef(false)
  const reduce = useSyncExternalStore(
    subscribeReduce,
    () => window.matchMedia(REDUCE).matches,
    () => false,
  )

  const many = slides.length > 1
  const hasDetails = slides.some((slide) => slide.details)
  const rotating = many && !paused && !hover && !focusWithin && !reduce
  const go = (i: number) => setIndex((i + slides.length) % slides.length)
  const count = slides.length

  // Left and right arrows step through the books while focus is on the art (its controls, the book's links), or
  // while nothing has focus and the art is on screen. Arrows with a modifier pass through: Alt+Arrow is the
  // browser's back and forward. The page has no sideways scroll for them to take from.
  useEffect(() => {
    if (count < 2) return
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      const section = sectionRef.current
      if (!section) return
      const active = document.activeElement
      const inside = !!active && section.contains(active)
      const box = section.getBoundingClientRect()
      const idle = (!active || active === document.body) && box.bottom > 0 && box.top < window.innerHeight
      if (!inside && !idle) return
      event.preventDefault()
      refocus.current = !!active?.closest('[aria-roledescription="slide"]')
      setIndex((i) => (i + (event.key === 'ArrowRight' ? 1 : -1) + count) % count)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [count])

  useEffect(() => {
    if (!refocus.current) return
    refocus.current = false
    const slide = sectionRef.current?.querySelectorAll('[aria-roledescription="slide"]')[index]
    slide?.querySelector<HTMLElement>('a, button')?.focus({ preventScroll: true })
  }, [index])
  const current = slides[index] ?? slides[0]
  const iconButton = cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'bg-background/60 text-foreground/80 hover:text-link size-9')
  /** A marker per book. Stacked, they live in the sliding panel; on split screens they sit beside it. */
  const markers = (className?: string, quiet = false) => (
    <span inert={quiet} className={cn('bg-background/60 rounded-ui h-9 items-center px-1 transition-opacity', quiet && 'opacity-60', className)}>
      {slides.map((slide, i) => (
        <button key={slide.key} type="button" onClick={() => go(i)} aria-label={`Show ${slide.title}`} aria-current={i === index ? 'true' : undefined} className="group grid size-7 place-items-center">
          <span className={cn('rounded-ui h-1 w-4 transition-colors', i === index ? 'bg-foreground' : 'bg-foreground/50 group-hover:bg-foreground/80')} />
        </button>
      ))}
    </span>
  )
  // Pause matters only while things move; stepping only with more than one book. With neither, there are no controls.
  const canPause = !reduce
  const hasControls = canPause || many

  return (
    // Stacked, this simply flows: the description, the art, the rest. On split screens the art lifts out to cover the
    // left half, and the description and the rest (a FillColumn, which steps aside here so its items join in) form
    // one column on the right: wrapping, so what doesn't fit moves into a clipped second column, and centered, so
    // whatever fits sits in the middle, at least 40px from either edge.
    <div
      className={cn(
        'split:relative split:flex split:h-[calc(100svh-var(--header-h))] split:flex-col split:flex-wrap split:justify-center split:gap-x-16 split:overflow-hidden split:py-10 split:pr-12 split:pl-[calc(50%+3rem)] split:*:w-full',
        className,
      )}
    >
      <div className="split:p-0 px-6 pt-12 pb-10 sm:px-10">{intro}</div>

      <section
        ref={sectionRef}
        // a11y-only text; not CMS-managed.
        aria-roledescription={many ? 'carousel' : undefined}
        aria-labelledby={labelId}
        // Stacked, a band between the description and the posts, ruled top and bottom like the header (--border).
        className="border-border split:absolute split:inset-y-0 split:left-0 split:w-1/2! split:border-0 relative grid border-y"
        onPointerEnter={(event) => event.pointerType === 'mouse' && setHover(true)}
        onPointerLeave={(event) => event.pointerType === 'mouse' && setHover(false)}
        onFocus={() => setFocusWithin(true)}
        onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setFocusWithin(false)}
      >
        {/* Stacked, the name sits across from the controls, on night at 85% so it reads over any art (see globals.css). */}
        <Eyebrow id={labelId} className="bg-background/85 rounded-ui split:hidden absolute top-3 left-3 z-20 flex h-9 items-center px-3">
          {label}
        </Eyebrow>
        <BreathingArt
          focus={origin}
          cloud={current.cloud}
          cloudOn={current.cloudOn ?? true}
          paused={paused}
          onBreath={() => {
            const next = rotating ? (index + 1) % slides.length : index
            if (next !== index) setIndex(next)
            setOrigin(slides[next].focus)
          }}
          // Stacked, the art takes most of the first screen, so the book over it still leaves the art room.
          className="split:min-h-0 min-h-[calc((100svh-var(--header-h))*0.7)]"
          art={slides.map((slide, i) => (
            <div key={slide.key} aria-hidden={i !== index} className={cn('absolute inset-0 transition-opacity duration-2000 ease-in-out', i === index ? 'opacity-100' : 'opacity-0')}>
              {slide.art}
            </div>
          ))}
          controls={
            hasControls && (
              // The controls tuck behind one toggle (a disclosure): pause, previous, and next slide out to its left. On
              // split screens the markers wait beside them, quiet until it opens; stacked, they slide out too, between
              // previous and next. Escape closes the panel and returns focus to the toggle. Labels here are a11y-only
              // text; not CMS-managed.
              <div
                className="flex items-center gap-1.5"
                onKeyDown={(event) => {
                  if (event.key === 'Escape' && controlsOpen) {
                    setControlsOpen(false)
                    toggleRef.current?.focus()
                  }
                }}
              >
                {/* First in tab order, last on screen: the revealed controls follow it for the keyboard. */}
                <button
                  ref={toggleRef}
                  type="button"
                  onClick={() => setControlsOpen((open) => !open)}
                  aria-expanded={controlsOpen}
                  aria-controls={panelId}
                  aria-label="Animation and book controls"
                  title="Animation and book controls"
                  className={cn(iconButton, 'order-last', controlsOpen && 'text-link')}
                >
                  <SlidersHorizontal aria-hidden />
                </button>
                <div id={panelId} data-open={controlsOpen} inert={!controlsOpen} className="controls-panel flex items-center gap-1.5">
                  {canPause && (
                    <button type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Play animation' : 'Pause animation'} className={iconButton}>
                      {paused ? <Play aria-hidden /> : <Pause aria-hidden />}
                    </button>
                  )}
                  {many && (
                    <>
                      <button type="button" onClick={() => go(index - 1)} aria-label="Previous book" className={iconButton}>
                        <ChevronLeft aria-hidden />
                      </button>
                      {markers('split:hidden flex')}
                      <button type="button" onClick={() => go(index + 1)} aria-label="Next book" className={iconButton}>
                        <ChevronRight aria-hidden />
                      </button>
                    </>
                  )}
                </div>
                {/* Split screens: beside the panel. Closed, a quiet sign there's more than one book (inert, and hidden from
                    screen readers, which hear "1 of 3" on each slide); open, a marker per book. Stacked, they're in the panel. */}
                {many && markers('split:flex hidden', !controlsOpen)}
              </div>
            )
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

      {rest}
    </div>
  )
}
