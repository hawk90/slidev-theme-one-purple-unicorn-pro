import { configs } from '@slidev/client'
import { defineAppSetup } from '@slidev/types'
import { setupBorderBeams } from '../utils/border-beam'
import { setupPrintExport } from '../utils/print-export'
import { setupPalette } from '../utils/palette'

export default defineAppSetup(({ router }) => {
  if (typeof window === 'undefined') return
  setupPalette(configs.themeConfig) // only when themeConfig sets colors
  setupPrintExport(router) // before setupBorderBeams: it tells isPrintMode about the router
  setupBorderBeams()
})
