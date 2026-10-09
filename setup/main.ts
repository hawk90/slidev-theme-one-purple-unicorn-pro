import { configs } from '@slidev/client'
import { defineAppSetup } from '@slidev/types'
import { setupBorderBeams } from '../utils/border-beam'
import { setupPrintExport } from '../utils/print-export'
import { setupPalette } from '../utils/palette'

export default defineAppSetup(({ router }) => {
  if (typeof window === 'undefined') return
  setupPalette(configs.themeConfig) // only when themeConfig sets colors
  // themeConfig codeFocus: tint → focused code lines are tinted, none dimmed
  if (configs.themeConfig?.codeFocus === 'tint') document.documentElement.classList.add('code-focus-tint')
  setupPrintExport(router) // before setupBorderBeams: it tells isPrintMode about the router
  setupBorderBeams()
})
