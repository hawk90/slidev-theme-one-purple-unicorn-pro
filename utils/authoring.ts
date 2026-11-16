// Authoring aids (global-bottom.vue, custom-nav-controls.vue, setup/shortcuts.ts):
// - a layout guide (safe area, 12 columns, center lines) on `shift+g` or the
//   nav bar's button; never in exports;
// - dev only: a slide whose content runs past its bottom gets a red outline
//   and one console warning (slides with `fit` shrink instead);
// - a picture that fails to load shows the path it expected;
// - `wip: true` (or a label) on a slide, or in the headmatter for all of
//   them, puts a draft watermark across it (exports too: it is a draft).

import { ref } from 'vue'

/** The layout guide's state, shared by the hotkey, the nav button and the overlay */
export const layoutGuide = ref(false)
export const toggleLayoutGuide = () => { layoutGuide.value = !layoutGuide.value }

/** The watermark's text for a slide's `wip` (its own, else the deck's), or '' */
export function wipLabel(own: unknown, deck: unknown): string {
  const v = own === undefined ? deck : own
  if (v === undefined || v === null || v === false || v === 'false') return ''
  if (typeof v === 'string' && v.trim() && v !== 'true') return v.trim()
  return 'WIP'
}

function markMissing(img: HTMLImageElement) {
  if (!img.closest('.slidev-page') || img.classList.contains('asset-missing')) return
  const src = img.getAttribute('src') ?? ''
  if (!src || src.startsWith('data:')) return
  img.classList.add('asset-missing')
  const note = document.createElement('span')
  note.className = 'asset-missing-note'
  note.textContent = `missing: ${src}`
  img.before(note)
  console.warn(`[theme] missing asset: ${src}`)
}

/** Whether a picture has failed to load (done, with no pixels) */
const failed = (img: HTMLImageElement) => img.complete && img.naturalWidth === 0 && !!img.getAttribute('src')

/**
 * Pictures that fail to load: a box naming the path, in their place. Those
 * that failed before this started are found by `sweep` (call it as slides show).
 */
export function watchMissingAssets(): { stop: () => void, sweep: () => void } {
  const onError = (e: Event) => { if (e.target instanceof HTMLImageElement) markMissing(e.target) }
  const sweep = () => document.querySelectorAll<HTMLImageElement>('.slidev-page img:not(.asset-missing)').forEach(img => failed(img) && markMissing(img))
  document.addEventListener('error', onError, true)
  sweep()
  return { stop: () => document.removeEventListener('error', onError, true), sweep }
}
