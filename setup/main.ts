import { defineAppSetup } from '@slidev/types'
import { setupBorderBeams } from '../utils/border-beam'

export default defineAppSetup(() => {
  if (typeof window !== 'undefined') setupBorderBeams()
})
