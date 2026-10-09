import { defineShikiSetup } from '@slidev/types'
import theme from './themes/one-purple-unicorn.json'
import { cudaTransformer } from './cuda-transformer'
import { terminalTransformer } from './terminal-transformer'

export default defineShikiSetup(() => ({
  theme: theme as any,
  transformers: [
    cudaTransformer(),
    terminalTransformer(),
  ],
}))
