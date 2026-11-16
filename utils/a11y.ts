// Accessibility helpers (global-bottom.vue, custom-nav-controls.vue,
// setup/shortcuts.ts): the high-contrast switch (styles/a11y.css) and the
// text announced to screen readers when the slide changes.

import { ref, watch } from 'vue'

/** High contrast on or off; `highContrast: true` in the headmatter starts it on */
export const highContrast = ref(false)
export const toggleHighContrast = () => { highContrast.value = !highContrast.value }

if (typeof document !== 'undefined')
  watch(highContrast, on => document.documentElement.classList.toggle('high-contrast', on), { immediate: true })

/** "Slide 3 of 20: Title" (the title only when there is one) */
export function slideAnnouncement(no: number, total: number, title?: string): string {
  const clean = String(title ?? '').replace(/<[^>]*>/g, '').trim()
  return `Slide ${no} of ${total}${clean ? `: ${clean}` : ''}`
}
