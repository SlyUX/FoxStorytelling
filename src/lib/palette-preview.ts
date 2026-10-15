/**
 * Previewing a candidate palette (globals.css → PREVIEW PALETTES): a design
 * tool while the palette is reworked, not part of the site. Picked on the
 * styleguide, the choice is kept in this browser and set as `data-palette` on
 * <html> before the page paints, so every page shows it until reset. Its words
 * are the tool's, not the site's, so they live here rather than in the Studio.
 * Remove this file, PalettePreview, and the palettes once one is chosen.
 */
export const PALETTES = [
  { id: 'current', name: 'Current', note: 'Night, bone, the fox red, and amber.' },
  { id: 'ink', name: 'Ink', note: 'Charcoal, blood reds, and cool grays, with a wine. White is the light.' },
  { id: 'deep-sea', name: 'Deep Sea', note: 'Navy, slate, and crimson, with the amber as lamplight.' },
] as const

export const PALETTE_KEY = 'palette-preview'

/** Runs before the page paints (root layout): the palette kept in this browser, if any. */
export const PALETTE_SCRIPT = `try{var p=localStorage.getItem('${PALETTE_KEY}');if(p)document.documentElement.dataset.palette=p}catch(e){}`
