import { defineShikiSetup } from '@slidev/types'
import theme from './themes/one-purple-unicorn.json'
import { cudaTransformer, quietColors } from './cuda-transformer'
import { terminalTransformer } from './terminal-transformer'
import { cudaLangs } from './cuda-lang'

export default defineShikiSetup(() => ({
  theme: theme as any,
  // No time limit per line (Shiki's default is 500 ms, then the rest of the
  // line is left as one token). The first lines of a block are tokenized while
  // the grammar is still compiling (C++ is heavy on the JS regex engine), and
  // on a busy machine they came out in one color, in dev and in exports.
  tokenizeTimeLimit: 0,
  // A line this long (minified code, base64) is left uncolored: tokenizing it
  // can take seconds per line
  tokenizeMaxLineLength: 2000,
  // ```cuda / ```cu / ```cuh: C++ (setup/cuda-lang.ts)
  langs: cudaLangs,
  transformers: [
    cudaTransformer({ quiet: quietColors(theme) }),
    terminalTransformer(),
  ],
}))
