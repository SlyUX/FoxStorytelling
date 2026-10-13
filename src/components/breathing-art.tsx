'use client'

import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

/**
 * Art that breathes. The image swells past "cover" and settles back every 20
 * seconds, brightening as it swells and fading as it settles (`--breath`,
 * `--breath-dim`, `--breath-bright`, and `.breathe` in globals.css), while a
 * dark cloud rolls over it (black, or the color picked in the Studio),
 * thickening and fading in step. As the page scrolls away, art and cloud fade
 * into the night (`.recede`).
 *
 * The cloud is never the same twice: it's drawn from noise that moves through
 * time, so each frame grows out of the one before, from a new random seed on
 * every visit. Pausing stops both; reduced motion stills the image and skips
 * the cloud, leaving the vignette.
 *
 * BookSpotlight owns pausing (it also stops the rotation) and the controls,
 * and hears each breath end, when the art is settled and dimmest, to change
 * books.
 */
export function BreathingArt({
  art,
  focus,
  cloud,
  paused,
  onBreath,
  controls,
  className,
}: {
  art: React.ReactNode
  /** The hotspot, as a CSS position: kept in view, and where the breath grows from. */
  focus: string
  /** The cloud's color (hex), picked in the Studio; without one, the --cloud token. */
  cloud?: string | null
  paused: boolean
  /** Called as each breath ends: the art is settled and at its dimmest. */
  onBreath?: () => void
  /** Buttons in the bottom-left corner. */
  controls?: React.ReactNode
  className?: string
}) {
  const artRef = useRef<HTMLDivElement>(null)

  return (
    <div data-paused={paused} className={cn('bg-background relative isolate overflow-hidden', className)}>
      {/* The art and its cloud fade into the night as the first screen scrolls away; the controls stay. */}
      <div className="recede absolute inset-0">
        <div
          ref={artRef}
          onAnimationIteration={(event) => event.target === event.currentTarget && onBreath?.()}
          className="breathe absolute inset-0"
          style={{ '--focus': focus } as React.CSSProperties}
        >
          {art}
        </div>
        <CloudLayer artRef={artRef} paused={paused} color={cloud} />
        {/* Vignette: holds the edges in shadow, so the art sinks into the page. */}
        <div aria-hidden className="to-background/80 pointer-events-none absolute inset-0 bg-radial from-transparent from-45%" />
      </div>
      {controls && <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5">{controls}</div>}
    </div>
  )
}

/** The cloud's resolution across. CSS scales it up to the column, and that softness is the cloud's edge. */
const COLS = 72
const FPS = 30
/** How dense the cloud gets at the top of a breath. Keep it subtle. */
const MAX_ALPHA = 0.525
/** Seconds for the cloud to take on a new color: about as long as the art's crossfade. */
const COLOR_EASE = 0.6

/** 3D value noise: smooth in x, y, and time. Seeded, so every visit starts from a new formation. */
function valueNoise(seed: number) {
  const hash = (x: number, y: number, z: number) => {
    let h = seed ^ Math.imul(x, 0x27d4eb2d) ^ Math.imul(y, 0x165667b1) ^ Math.imul(z, 0x9e3779b1)
    h = Math.imul(h ^ (h >>> 15), 0x85ebca6b)
    h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35)
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296
  }
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t
  return (x: number, y: number, z: number) => {
    const xi = Math.floor(x)
    const yi = Math.floor(y)
    const zi = Math.floor(z)
    const u = fade(x - xi)
    const v = fade(y - yi)
    const w = fade(z - zi)
    const c = (dx: number, dy: number, dz: number) => hash(xi + dx, yi + dy, zi + dz)
    return lerp(
      lerp(lerp(c(0, 0, 0), c(1, 0, 0), u), lerp(c(0, 1, 0), c(1, 1, 0), u), v),
      lerp(lerp(c(0, 0, 1), c(1, 0, 1), u), lerp(c(0, 1, 1), c(1, 1, 1), u), v),
      w,
    )
  }
}

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/** A hex token value as [r, g, b], or undefined. The minifier may shorten it (#330000 → #300), so both lengths count. */
const rgb = (hex: string) => {
  const m = hex.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (!m) return undefined
  const digits = m[1].length === 3 ? [...m[1]].map((d) => d + d).join('') : m[1]
  return [0, 2, 4].map((i) => parseInt(digits.slice(i, i + 2), 16))
}

/**
 * Draws the cloud. Runs only while the art is on screen, the tab is visible,
 * motion is allowed, and the art isn't paused; it keeps its own clock, so a
 * pause freezes the cloud and play resumes it from the same formation. When
 * the color changes (a new book), it eases into the new one rather than
 * switching.
 */
function CloudLayer({ artRef, paused, color }: { artRef: React.RefObject<HTMLDivElement | null>; paused: boolean; color?: string | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // The cloud's seed, clock, and showing color outlive pause and play, so play resumes the same formation.
  const clock = useRef<{ seed: number; elapsed: number; shown?: number[] } | null>(null)
  const colorRef = useRef(color)
  const redraw = useRef<() => void>(undefined)

  useEffect(() => {
    const canvas = canvasRef.current
    const art = artRef.current
    const ctx = canvas?.getContext('2d')
    const root = getComputedStyle(document.documentElement)
    // The color picked in the Studio, or the --cloud token. With neither, there's no cloud.
    const fallback = rgb(root.getPropertyValue('--cloud'))
    const goal = () => rgb(colorRef.current ?? '') ?? fallback
    // The same opacities the art breathes between, so the cloud fades with it. Without them, no fade.
    const dim = parseFloat(root.getPropertyValue('--breath-dim'))
    const bright = parseFloat(root.getPropertyValue('--breath-bright'))
    const opacityAt = (at: number) => (Number.isFinite(dim) && Number.isFinite(bright) ? dim + (bright - dim) * at : 1)
    if (!canvas || !art || !ctx) return

    clock.current ??= { seed: (Math.random() * 2 ** 31) | 0, elapsed: 0 }
    const state = clock.current
    const noise = valueNoise(state.seed)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    let image = ctx.createImageData(1, 1)
    let onScreen = true
    let frame = 0
    let last = 0

    const size = () => {
      const rows = Math.max(1, Math.round((COLS * canvas.clientHeight) / Math.max(1, canvas.clientWidth)))
      canvas.width = COLS
      canvas.height = rows
      image = ctx.createImageData(COLS, rows)
    }

    /** Where the art is in its breath: 0 settled, 1 fully swollen. Read from the CSS animation, so the two stay in step. */
    const breath = () => {
      const animation = art.getAnimations()[0]
      const duration = Number(animation?.effect?.getTiming().duration) || 20000
      const t = (Number(animation?.currentTime ?? 0) % duration) / duration
      return 0.5 - 0.5 * Math.cos(2 * Math.PI * t)
    }

    /** `step` is how far to move toward the goal color: 0 holds it, 1 arrives. */
    const draw = (step: number) => {
      const target = goal()
      if (!target) return ctx.clearRect(0, 0, canvas.width, canvas.height)
      state.shown = state.shown ? state.shown.map((c, k) => c + (target[k] - c) * step) : target
      const [r, g, b] = state.shown.map(Math.round)
      const { width, height, data } = image
      const now = breath()
      const swell = (0.35 + 0.65 * now) * opacityAt(now)
      const drift = state.elapsed * 0.06 // the cloud rolls slowly across
      const time = state.elapsed * 0.1 // and slowly re-forms
      const scale = 3 / COLS // about three cloud masses across
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const nx = x * scale + drift
          const ny = y * scale
          const n = (noise(nx, ny, time) * 4 + noise(nx * 2, ny * 2, time * 1.6) * 2 + noise(nx * 4, ny * 4, time * 2.2)) / 7
          const i = (y * width + x) * 4
          data[i] = r
          data[i + 1] = g
          data[i + 2] = b
          data[i + 3] = 255 * MAX_ALPHA * swell * smoothstep(0.42, 0.7, n)
        }
      }
      ctx.putImageData(image, 0, 0)
    }

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      if (now - last < 1000 / FPS) return
      // Cap the step, so returning to a background tab doesn't jump the cloud.
      const dt = last ? Math.min(now - last, 100) / 1000 : 0
      state.elapsed += dt
      last = now
      draw(1 - Math.exp(-dt / COLOR_EASE))
    }

    const update = () => {
      const run = onScreen && !document.hidden && !reduce.matches && !paused
      cancelAnimationFrame(frame)
      frame = 0
      last = 0
      if (reduce.matches) ctx.clearRect(0, 0, canvas.width, canvas.height)
      else if (run) frame = requestAnimationFrame(tick)
    }

    const resize = new ResizeObserver(() => {
      size()
      if (!reduce.matches) draw(0)
    })
    // A new color while the cloud is still (paused): show it at once.
    redraw.current = () => {
      if (!frame && !reduce.matches) draw(1)
    }
    const visible = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
      update()
    })
    resize.observe(canvas)
    visible.observe(canvas)
    document.addEventListener('visibilitychange', update)
    reduce.addEventListener('change', update)
    update()

    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      visible.disconnect()
      document.removeEventListener('visibilitychange', update)
      reduce.removeEventListener('change', update)
    }
  }, [artRef, paused])

  useEffect(() => {
    colorRef.current = color
    redraw.current?.()
  }, [color])

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 size-full" />
}
