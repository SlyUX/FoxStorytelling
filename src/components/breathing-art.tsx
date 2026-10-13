'use client'

import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Art that breathes. The image swells past "cover" and settles back every 20
 * seconds (`--breath` and `.breathe` in globals.css), while a very dark red
 * cloud rolls over it, thickening as the image swells and thinning as it
 * settles.
 *
 * The cloud is never the same twice: it's drawn from noise that moves through
 * time, so each frame grows out of the one before, from a new random seed on
 * every visit. A pause button stops both; reduced motion stills the image and
 * skips the cloud, leaving the vignette.
 */
export function BreathingArt({ art, focus, children, className }: { art: React.ReactNode; focus: string; children?: React.ReactNode; className?: string }) {
  const [paused, setPaused] = useState(false)
  const artRef = useRef<HTMLDivElement>(null)

  return (
    <div data-paused={paused} className={cn('bg-background relative isolate overflow-hidden', className)}>
      <div ref={artRef} className="breathe absolute inset-0" style={{ '--focus': focus } as React.CSSProperties}>
        {art}
      </div>
      <CloudLayer artRef={artRef} paused={paused} />
      {/* Vignette: holds the edges in shadow, so the art sinks into the page. */}
      <div aria-hidden className="to-background/80 pointer-events-none absolute inset-0 bg-radial from-transparent from-45%" />
      {children}
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        // a11y-only text; not CMS-managed.
        aria-label={paused ? 'Play animation' : 'Pause animation'}
        className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'bg-background/60 text-foreground/80 hover:text-link absolute top-3 right-3 z-10 size-9 motion-reduce:hidden')}
      >
        {paused ? <Play aria-hidden /> : <Pause aria-hidden />}
      </button>
    </div>
  )
}

/** The cloud's resolution across. CSS scales it up to the column, and that softness is the cloud's edge. */
const COLS = 72
const FPS = 30
/** How dense the cloud gets at the top of a breath. Keep it subtle. */
const MAX_ALPHA = 0.75

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
 * pause freezes the cloud and play resumes it from the same formation.
 */
function CloudLayer({ artRef, paused }: { artRef: React.RefObject<HTMLDivElement | null>; paused: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // The cloud's seed and clock outlive pause and play, so play resumes the same formation.
  const clock = useRef<{ seed: number; elapsed: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const art = artRef.current
    const ctx = canvas?.getContext('2d')
    // The cloud's color is the --cloud token; without it, there's no cloud.
    const color = rgb(getComputedStyle(document.documentElement).getPropertyValue('--cloud'))
    if (!canvas || !art || !ctx || !color) return
    const [r, g, b] = color

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

    const draw = () => {
      const { width, height, data } = image
      const swell = 0.35 + 0.65 * breath()
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
      if (last) state.elapsed += Math.min(now - last, 100) / 1000
      last = now
      draw()
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
      if (!reduce.matches) draw()
    })
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

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 size-full" />
}
