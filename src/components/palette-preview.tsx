'use client'

import { useSyncExternalStore } from 'react'

import { PALETTE_KEY, PALETTES } from '@/lib/palette-preview'

/** The palette showing, followed as it changes (on this page, or from the picker). */
const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-palette'] })
  return () => observer.disconnect()
}
const usePalette = () =>
  useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset.palette ?? 'current',
    () => 'current',
  )

function setPalette(id: string) {
  if (id === 'current') delete document.documentElement.dataset.palette
  else document.documentElement.dataset.palette = id
  try {
    if (id === 'current') localStorage.removeItem(PALETTE_KEY)
    else localStorage.setItem(PALETTE_KEY, id)
  } catch {
    // Storage blocked (a private window): the preview still shows on this page.
  }
}

/** The styleguide's picker (see lib/palette-preview.ts). */
export function PalettePicker() {
  const palette = usePalette()
  return (
    <fieldset>
      <legend className="mb-3 font-semibold">Preview a palette</legend>
      <div className="grid gap-3 sm:grid-cols-3">
        {PALETTES.map((p) => (
          <label key={p.id} className="bg-card border-border rounded-ui has-checked:border-ring flex cursor-pointer gap-3 border p-4 transition-colors">
            <input type="radio" name="palette" value={p.id} checked={palette === p.id} onChange={() => setPalette(p.id)} className="accent-primary mt-1 size-4 shrink-0" />
            <span>
              <span className="block font-semibold">{p.name}</span>
              <span className="text-muted-foreground mt-1 block text-sm leading-snug">{p.note}</span>
            </span>
          </label>
        ))}
      </div>
      <p className="text-muted-foreground mt-3 text-sm">A preview repaints every page in this browser, Home included, until you pick Current again. The swatches and contrast below follow it.</p>
    </fieldset>
  )
}

/** On every page while a preview palette shows: which one, and the way back. */
export function PaletteIndicator() {
  const palette = usePalette()
  const showing = PALETTES.find((p) => p.id !== 'current' && p.id === palette)
  if (!showing) return null
  return (
    <div role="status" className="bg-card border-border rounded-ui fixed right-4 bottom-4 z-50 flex items-center gap-3 border px-4 py-2 text-sm shadow-lg">
      <span>
        Previewing <strong>{showing.name}</strong>
      </span>
      <button type="button" onClick={() => setPalette('current')} className="hover:text-link underline underline-offset-4">
        Reset
      </button>
    </div>
  )
}
