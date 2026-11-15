import { configs } from '@slidev/client'
import { defineAppSetup } from '@slidev/types'
import { setupBorderBeams } from '../utils/border-beam'
import { setupPrintExport } from '../utils/print-export'
import { setupSlideArrival } from '../utils/slide-arrival'
import { applyThemeConfig } from '../utils/theme-config'

export default defineAppSetup(({ router }) => {
  if (typeof window === 'undefined') return
  applyThemeConfig(configs.themeConfig) // palette colors, codeFocus
  setupPrintExport(router) // before setupBorderBeams: it tells isPrintMode about the router
  setupBorderBeams()
  setupSlideArrival() // entrances wait for the slide transition
})
