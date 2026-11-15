// The deck's themeConfig, applied once at startup (setup/main.ts): the
// palette (utils/palette.ts) and the code focus style. Idempotent, so an HMR
// re-run with a changed headmatter replaces what the last one set.

import type { PaletteConfig } from './palette'
import { setupPalette } from './palette'

export interface ThemeConfig extends PaletteConfig {
  /** `tint`: focused code lines are tinted, none dimmed (styles/code-theme.css) */
  codeFocus?: string
}

export function applyThemeConfig(config: ThemeConfig | undefined) {
  if (typeof document === 'undefined') return
  setupPalette(config) // only when themeConfig sets colors
  document.documentElement.classList.toggle('code-focus-tint', config?.codeFocus === 'tint')
}
