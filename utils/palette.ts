// Palette from `themeConfig` colors. Without any, nothing runs and the CSS
// defaults (colors.css, gradients.css, light-theme.css) apply as they are.
//
//   themeConfig:
//     primary: '#0ea5e9'      # brand: scale, gradients, glows, light-mode shades
//     secondary: '#a78bfa'    # gradient partner (default: from primary)
//     accents:                # blue, cyan, green, yellow, red: their light-mode
//       green: '#4ade80'      # shades and alert tints follow
//
// The scale and gradient stops keep the default purple palette's steps
// (lightness and chroma offsets, hue turns, measured in OKLCH), so any brand
// gets the same shape. Light-mode shades keep the default's offsets too, and
// go deeper if needed to reach 4.5:1 on white.

type Oklch = [number, number, number] // L 0..1, C, H degrees

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const toGamma = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055)

function parseHex(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return null
  const h = m[1].length === 3 ? m[1].replace(/./g, '$&$&') : m[1]
  return [0, 2, 4].map(i => Number.parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number]
}

function rgbToOklch([r, g, b]: [number, number, number]): Oklch {
  const [lr, lg, lb] = [r, g, b].map(toLinear)
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)
  const L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
  return [L, Math.hypot(A, B), (Math.atan2(B, A) * 180 / Math.PI + 360) % 360]
}

function oklchToRgb([L, C, H]: Oklch): [number, number, number] {
  const a = C * Math.cos(H * Math.PI / 180)
  const b = C * Math.sin(H * Math.PI / 180)
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ].map(toGamma) as [number, number, number]
}

const inGamut = (rgb: number[]) => rgb.every(c => c >= -1e-4 && c <= 1 + 1e-4)

// Out-of-sRGB colors keep lightness and hue and lose chroma until they fit
function toHex([L, C, H]: Oklch) {
  L = Math.min(1, Math.max(0, L))
  let rgb = oklchToRgb([L, C, H])
  if (!inGamut(rgb)) {
    let lo = 0
    let hi = C
    for (let i = 0; i < 20; i++) {
      const mid = (lo + hi) / 2
      if (inGamut(oklchToRgb([L, mid, H]))) lo = mid
      else hi = mid
    }
    rgb = oklchToRgb([L, lo, H])
  }
  return `#${rgb.map(c => Math.round(Math.min(1, Math.max(0, c)) * 255).toString(16).padStart(2, '0')).join('')}`
}

function luminance(hex: string) {
  const [r, g, b] = parseHex(hex)!.map(toLinear)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrastOnWhite = (hex: string) => 1.05 / (luminance(hex) + 0.05)

// Step from a base color: lightness offset, chroma factor, hue turn
const step = ([L, C, H]: Oklch, dL: number, cx: number, dH = 0): Oklch => [L + dL, C * cx, (H + dH + 360) % 360]

// The default purple's scale relative to its 400 (#c678dd)
const SCALE: Record<string, [number, number, number]> = {
  100: [0.224, 0.35, -4.0],
  300: [0.071, 1.06, -4.7],
  400: [0, 1, 0],
  500: [-0.056, 1.03, 0.9],
  600: [-0.112, 1.05, 2.1],
  700: [-0.178, 0.94, 2.8],
  800: [-0.270, 0.76, 2.1],
  900: [-0.367, 0.57, 0.7],
}

// Light-mode shades: the default palette's own offsets from each dark color
// (measured from the hand-picked values), deepened further if a color still
// doesn't reach 4.5:1 on white
const LIGHT_STEP: Record<string, [number, number, number]> = {
  primary: [-0.150, 1.19, -1.1],
  secondary: [-0.201, 1.06, 3.5],
  blue: [-0.201, 1.06, 3.5],
  cyan: [-0.191, 0.95, 2.2],
  green: [-0.249, 1.25, 4.4],
  yellow: [-0.301, 1.12, -1.6],
  red: [-0.146, 1.17, 3.1],
}

function lightShade(base: Oklch, kind: keyof typeof LIGHT_STEP) {
  const [dL, cx, dH] = LIGHT_STEP[kind]
  let [L, C, H] = step(base, dL, cx, dH)
  let hex = toHex([L, C, H])
  while (contrastOnWhite(hex) < 4.5 && L > 0.2) {
    L -= 0.01
    hex = toHex([L, C, H])
  }
  return { hex, L, C, H }
}

const DEFAULT_PRIMARY = parseHex('#c678dd')!

// A configured color, or null (with a warning when it is set but not a hex color)
function color(value: unknown, key: string) {
  if (value == null || value === '') return null
  const rgb = parseHex(String(value))
  if (!rgb) console.warn(`[one-purple-unicorn] themeConfig.${key}: expected a hex color like '#0ea5e9', got ${JSON.stringify(value)}`)
  return rgb
}

const ACCENTS = ['blue', 'cyan', 'green', 'yellow', 'red'] as const
const ALERT_OF: Partial<Record<typeof ACCENTS[number], string>> = { blue: 'info', green: 'success', yellow: 'warning', red: 'error' }

export interface PaletteConfig {
  primary?: string
  secondary?: string
  accents?: Partial<Record<typeof ACCENTS[number], string>>
}

/** CSS declarations for :root from the configured colors; '' when none are set */
export function paletteCss(config: PaletteConfig | undefined): string {
  if (!config) return ''
  const vars: Record<string, string> = {}
  const primaryRgb = color(config.primary, 'primary')
  const secondaryRgb = color(config.secondary, 'secondary')

  if (primaryRgb || secondaryRgb) {
    const P = rgbToOklch(primaryRgb ?? DEFAULT_PRIMARY)
    // The default partner sits a quarter turn before the brand, a little lighter and softer
    const S = secondaryRgb ? rgbToOklch(secondaryRgb) : step(P, 0.037, 0.74, -72.9)

    if (primaryRgb) {
      const hex = toHex(P) // 400 is exactly the given color
      for (const [k, offsets] of Object.entries(SCALE)) vars[`--primary-${k}`] = k === '400' ? hex : toHex(step(P, ...offsets))
      vars['--one-dark-purple'] = hex
      vars['--one-dark-magenta'] = hex
      vars['--glow-color'] = primaryRgb.map(c => Math.round(c * 255)).join(', ')

      // Light mode: the 400 shade, and the others at the default's offsets from it
      const light = lightShade(P, 'primary')
      vars['--light-primary'] = light.hex
      vars['--light-magenta'] = light.hex
      vars['--light-primary-300'] = toHex([light.L - 0.039, P[1] * 1.07, light.H])
      vars['--light-primary-500'] = toHex([light.L - 0.033, P[1] * 1.10, light.H])
      vars['--light-primary-600'] = toHex([light.L - 0.073, P[1] * 1.01, light.H])
    }
    vars['--secondary-400'] = toHex(S)
    vars['--light-secondary'] = lightShade(S, 'secondary').hex

    // Title gradients: the default's stops as turns around brand and partner
    const end = toHex(step(S, -0.016, 1.18, 9.3))
    vars['--cover-h1-gradient'] = `linear-gradient(135deg, ${toHex(step(P, -0.088, 1.34, -25.5))}, ${toHex(step(P, -0.038, 1.29, 36.1))}, ${toHex(step(P, -0.108, 1.25, -41.1))}, ${end})`
    vars['--cover-h2-gradient'] = `linear-gradient(135deg, ${toHex(step(P, 0.015, 0.97, -24.7))}, ${end})`
  }

  for (const name of ACCENTS) {
    const rgb = color(config.accents?.[name], `accents.${name}`)
    if (!rgb) continue
    const base = rgbToOklch(rgb)
    const hex = toHex(base)
    vars[`--one-dark-${name}`] = hex
    vars[`--light-${name}`] = lightShade(base, name).hex
    const alert = ALERT_OF[name]
    if (alert) vars[`--alert-${alert}-bg`] = `color-mix(in srgb, ${hex} 10%, transparent)`
  }

  const decls = Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`).join('\n')
  return decls ? `:root {\n${decls}\n}` : ''
}

/** Apply the theme's `themeConfig` colors once, before the slides render */
export function setupPalette(config: PaletteConfig | undefined) {
  if (typeof document === 'undefined') return
  const css = paletteCss(config)
  // Reuse the element so a re-run (HMR) replaces the palette instead of stacking it
  let style = document.getElementById('theme-palette')
  if (!css) return style?.remove()
  if (!style) {
    style = document.createElement('style')
    style.id = 'theme-palette'
    document.head.appendChild(style)
  }
  style.textContent = css
}
