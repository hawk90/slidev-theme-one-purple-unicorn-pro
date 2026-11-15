import { configs } from '@slidev/client'
import { defineAppSetup } from '@slidev/types'
import { setupBorderBeams } from '../utils/border-beam'
import { setupPrintExport } from '../utils/print-export'
import { setupPrintMode } from '../utils/print-mode'
import { applyThemeConfig } from '../utils/theme-config'

// (Entrances waiting for the slide transition start in global-bottom.vue,
// next to the slides they watch: utils/slide-arrival.ts)
export default defineAppSetup(({ router }) => {
  if (typeof window === 'undefined') return
  setupPrintMode(router) // first: html.print-mode, and isPrintMode() learns the router
  applyThemeConfig(configs.themeConfig) // palette colors, codeFocus
  setupPrintExport() // effects redrawn as images in exports
  setupBorderBeams()
})
