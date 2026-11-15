// Slide backgrounds (components/internal/SlideBackground.vue): `background`
// (an image, a color or a gradient), `backgroundOpacity`, `backgroundFilter`,
// `backgroundScrim`, and the generated `bg:` patterns. Pure, so it is tested
// (test/background.test.ts).

export const BG_PATTERNS = ['mesh', 'aurora', 'grain', 'dots', 'grid'] as const
export type BgPattern = typeof BG_PATTERNS[number]

export type BackgroundKind = 'color' | 'gradient' | 'image'

const COLOR = /^(#[\da-f]{3,8}|(rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color|color-mix)\(.*\)|var\(--[\w-]+\)|transparent|[a-z]+)$/i
const GRADIENT = /^(repeating-)?(linear|radial|conic)-gradient\(/i

/** What a `background` value is: a CSS color (a hex, a function, a variable
 *  or a color name), a CSS gradient, or else an image path or URL */
export function backgroundKind(value: string): BackgroundKind {
  const v = value.trim()
  if (GRADIENT.test(v)) return 'gradient'
  // a bare word is a color name unless it looks like a file
  if (COLOR.test(v) && !/\.\w{2,5}$/.test(v)) return 'color'
  return 'image'
}

/** `backgroundOpacity`: 0–1, or a percentage ("60%"); null when unset or junk */
export function opacityOf(value: unknown): number | null {
  if (value === undefined || value === null || value === '') return null
  const text = String(value).trim()
  const n = Number.parseFloat(text)
  if (Number.isNaN(n)) return null
  const v = text.endsWith('%') ? n / 100 : n
  return Math.min(1, Math.max(0, v))
}

/** `bg`: one of the generated patterns, or null */
export function patternOf(value: unknown): BgPattern | null {
  const v = String(value ?? '').trim().toLowerCase()
  return (BG_PATTERNS as readonly string[]).includes(v) ? v as BgPattern : null
}

/**
 * The scrim over an image background, so text stays readable: on by default
 * for images, off for colors and gradients; `backgroundScrim: false` turns it
 * off, a number (0–1 or a percentage) sets its strength (default 0.55).
 */
export function scrimOf(value: unknown, kind: BackgroundKind | null): number | null {
  if (value === false || value === 'false') return null
  const set = opacityOf(value === true || value === 'true' ? undefined : value)
  if (set !== null) return set
  if (value === true || value === 'true') return 0.55
  return kind === 'image' ? 0.55 : null
}
