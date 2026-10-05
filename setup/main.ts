import { defineAppSetup } from '@slidev/types'
import { setupBorderBeams } from '../utils/border-beam'
import { setupPrintGradientText } from '../utils/print-gradient-text'

export default defineAppSetup(() => {
  if (typeof window === 'undefined') return
  setupBorderBeams()
  setupPrintGradientText()
})
