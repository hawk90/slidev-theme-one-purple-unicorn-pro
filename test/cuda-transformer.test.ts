import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { styledRuns } from './highlight.ts'
import { cudaTransformer, quietColors } from '../setup/cuda-transformer.ts'

// The names and their styles, fixed here (from the 13 patterns of v3.0.5), so
// a name dropped or recolored in the transformer fails a test
const STYLES = new Map<string, string>(Object.entries(
  JSON.parse(readFileSync(new URL('./fixtures/cuda-names.json', import.meta.url), 'utf8')),
))

const styleOf = (code: string, lang: string, word: string) =>
  styledRuns(code, lang).filter(([t]) => t === word).map(([, s]) => s)

const KERNEL = 'color:#a9dc76;font-weight:bold;'
const LAUNCH = 'color:#ff6188;font-weight:bold;'

describe('cudaTransformer: names', () => {
  it('has all 169 names', () => assert.equal(STYLES.size, 169))

  it('every name gets its style in C++', () => {
    const wrong = [...STYLES].filter(([w, s]) => !styleOf(`auto x = ${w};`, 'cpp', w).includes(s))
    assert.deepEqual(wrong.map(([w]) => w), [])
  })

  it('in Python too (numba: cuda.threadIdx.x)', () => {
    assert.deepEqual(styleOf('i = cuda.threadIdx.x', 'python', 'threadIdx'), [STYLES.get('threadIdx')])
  })

  for (const [lang, code] of [
    ['cpp', 'printf("cudaMalloc failed");'],
    ['cpp', '// call cudaMalloc first'],
    ['cpp', '/* cudaMalloc */'],
    ['python', 'print("cudaMalloc failed")'],
    ['python', '# cudaMalloc here'],
  ]) {
    it(`not in a string or comment: ${lang} ${code}`, () =>
      assert.deepEqual(styledRuns(code, lang).filter(([t]) => t === 'cudaMalloc'), []))
  }

  for (const w of ['mydim3', 'dim3x', 'my_threadIdx', 'cudaMallocX'])
    it(`not part of a longer word: ${w}`, () =>
      assert.deepEqual(styledRuns(`auto v = ${w};`, 'cpp').filter(([, s]) => [...STYLES.values()].includes(s)), []))

  // Shiki tokenizes `3dim3` as the number 3 and the name dim3, in two spans
  // (not valid C++ anyway): dim3 is marked, as the comment in the transformer says
  it('3dim3: Shiki splits off the number, dim3 is marked', () =>
    assert.notDeepEqual(styleOf('auto v = 3dim3;', 'cpp', 'dim3'), []))
})

describe('cudaTransformer: kernel launch', () => {
  it('marks name and <<< >>>', () => {
    const runs = styledRuns('saxpy<<<blocks, threads>>>(n, a, x, y);', 'cpp')
    assert.ok(runs.some(([t, s]) => t === 'saxpy' && s === KERNEL))
    assert.equal(runs.filter(([t, s]) => (t === '<<<' || t === '>>>') && s === LAUNCH).length, 2)
  })

  it('with nested template arguments', () => {
    const runs = styledRuns('foo<std::vector<int>><<<g, b>>>(x);', 'cpp')
    assert.ok(runs.some(([t, s]) => t === 'foo' && s === KERNEL), JSON.stringify(runs))
    assert.equal(runs.filter(([t, s]) => (t === '<<<' || t === '>>>') && s === LAUNCH).length, 2)
  })

  it('two launches on one line', () => {
    const runs = styledRuns('a<<<1, 1>>>(); b<<<2, 2>>>();', 'cpp')
    assert.deepEqual(runs.filter(([, s]) => s === KERNEL).map(([t]) => t), ['a', 'b'])
  })

  for (const code of ['// k<<<g, b>>>(x);', 'printf("k<<<g, b>>>");', '/* k<<<1,1>>>() */']) {
    it(`not in a comment or string: ${code}`, () =>
      assert.deepEqual(styledRuns(code, 'cpp').filter(([, s]) => s === KERNEL || s === LAUNCH), []))
  }

  it('text is unchanged', () => {
    const code = 'foo<std::vector<int>><<<g, b>>>(x); // done'
    assert.equal(styledRuns(code, 'cpp').map(([t]) => t).join(''), code)
  })
})

describe('cudaTransformer: comment and string colors from the theme', () => {
  const theme = JSON.parse(readFileSync(new URL('../setup/themes/one-purple-unicorn.json', import.meta.url), 'utf8'))

  it('quietColors reads comment and string from tokenColors', () =>
    assert.deepEqual(quietColors(theme), ['#5c6370', '#98c379']))

  it('quietColors: scope as a string or a list, other scopes ignored', () =>
    assert.deepEqual(quietColors({ tokenColors: [
      { scope: ['comment', 'punctuation'], settings: { foreground: '#111111' } },
      { scope: 'string', settings: { foreground: '#222222' } },
      { scope: 'string.regexp', settings: { foreground: '#333333' } },
      { scope: 'keyword' },
    ] }), ['#111111', '#222222']))

  // Another theme's colors: this theme's comments are no longer recognized
  it('names in comments are marked when the colors do not match', async () => {
    const { createHighlighter } = await import('shiki')
    const hl = await createHighlighter({ themes: [theme], langs: ['cpp'] })
    const html = (quiet?: string[]) => hl.codeToHtml('// cudaMalloc', { lang: 'cpp', theme: theme.name, transformers: [cudaTransformer(quiet && { quiet })] })
    assert.doesNotMatch(html(), /color:#78dce8/, 'default: this theme')
    assert.match(html(['#123456']), /color:#78dce8/)
  })
})
