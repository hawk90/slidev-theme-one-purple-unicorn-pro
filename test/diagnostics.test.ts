import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { createHighlighter } from 'shiki'
import { diagnosticsTransformer, lineMark } from '../setup/diagnostics-transformer.ts'

const highlighter = await createHighlighter({ themes: ['github-dark'], langs: ['cpp', 'python', 'sql'] })
type Hast = any
const textOf = (n: Hast): string => n.type === 'text' ? n.value : (n.children ?? []).map(textOf).join('')
const cls = (n: Hast) => [n.properties?.class ?? []].flat().join(' ')
function lines(code: string, lang = 'cpp') {
  const pre = highlighter.codeToHast(code, { lang, theme: 'github-dark', transformers: [diagnosticsTransformer()] }).children[0] as Hast
  const codeEl = pre.children.find((c: Hast) => c.tagName === 'code')
  return codeEl.children.filter((c: Hast) => c.type === 'element')
}

describe('lineMark', () => {
  it('reads the marks in any line comment', () => {
    assert.deepEqual(lineMark('int *p = 0; // [!code error: null pointer]'), { kind: 'error', text: 'null pointer', at: 11 })
    assert.equal(lineMark('x = 1  # [!code value: 42]')?.kind, 'value')
    assert.equal(lineMark('SELECT 1 -- [!code warning: slow]')?.text, 'slow')
    assert.equal(lineMark('a(); /* [!code info: note] */')?.kind, 'info')
    assert.equal(lineMark('// [!code fold]')?.kind, 'fold')
    assert.equal(lineMark('i--; // a comment'), null)
  })
})

describe('diagnosticsTransformer', () => {
  it('error / warning: class, message after the code, comment gone', () => {
    const [a, b] = lines('int *p = 0; // [!code error: null pointer]\nfloat s; // [!code warning: unused]')
    assert.match(cls(a), /line-diag line-error/)
    assert.equal(textOf(a), 'int *p = 0;null pointer')
    assert.match(cls(b), /line-warning/)
    assert.equal(textOf(b), 'float s;unused')
  })
  it('value: a muted "= value"', () => {
    const [a] = lines('sum += x[i]; // [!code value: 1024.5]')
    assert.equal(textOf(a), 'sum += x[i];= 1024.5')
    assert.ok(!cls(a).includes('line-diag'))
  })
  it('fold: the lines above fold into the first, which carries the summary', () => {
    const ls = lines('#include <a>\n#include <b>\n// [!code fold: includes]\nint main() {}')
    assert.equal(ls.length, 4) // nothing removed: highlight ranges still count from line 1
    assert.deepEqual(ls.map(cls).map((c: string) => c.includes('line-folded')), [true, true, true, false])
    assert.match(cls(ls[0]), /line-fold-summary/)
    assert.equal(ls[0].properties['data-fold'], 'includes · 2 lines')
    // line numbers step over the folded lines (+1 from the row's own ::before)
    assert.equal(ls[0].properties.style, 'counter-increment: step 2')
  })
  it('python and sql comments', () => {
    assert.match(cls(lines('x = f()  # [!code error: boom]', 'python')[0]), /line-error/)
    assert.match(cls(lines('SELECT 1 -- [!code info: ok]', 'sql')[0]), /line-info/)
  })
})
