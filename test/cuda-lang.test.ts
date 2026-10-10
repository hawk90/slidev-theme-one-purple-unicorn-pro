import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createBundledHighlighter, createSingletonShorthands } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import { bundledLanguages } from 'shiki'
import { cudaLangs } from '../setup/cuda-lang.ts'

const theme = JSON.parse(readFileSync(new URL('../setup/themes/one-purple-unicorn.json', import.meta.url), 'utf8'))

// Slidev's path (@slidev/cli setupShiki): the bundled languages plus the
// setup's `langs` record, one singleton, a language loaded on first use
const shiki = createSingletonShorthands(createBundledHighlighter({
  engine: createJavaScriptRegexEngine,
  langs: { ...bundledLanguages, ...cudaLangs },
  themes: { [theme.name]: theme },
}))

const KERNEL = `__global__ void saxpy(int n, float a, const float *x, float *y) {
  int i = blockIdx.x * blockDim.x + threadIdx.x;
  if (i < n) y[i] = a * x[i] + y[i];
}`

// The token runs (text + style), without the language name on <pre>
const runs = async (lang: string) => {
  const html = await shiki.codeToHtml(KERNEL, { lang, theme: theme.name, tokenizeTimeLimit: 0 })
  return [...html.matchAll(/<span style="([^"]*)">([^<]*)<\/span>/g)].map(m => `${m[2]}|${m[1]}`)
}

describe('cuda / cu / cuh fences', () => {
  for (const lang of ['cuda', 'cu', 'cuh']) {
    it(`${lang} highlights like cpp`, async () => {
      const cpp = await runs('cpp')
      assert.ok(cpp.length > 20, 'cpp is tokenized')
      assert.deepEqual(await runs(lang), cpp)
    })
  }
})
