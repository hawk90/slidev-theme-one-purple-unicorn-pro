import { defineAppSetup } from '@slidev/types'
import { setupBorderBeams } from '../utils/border-beam'
import { setupPrintExport } from '../utils/print-export'

export default defineAppSetup(({ router }) => {
  if (typeof window === 'undefined') return
  setupBorderBeams()
  setupPrintExport(router)
})
