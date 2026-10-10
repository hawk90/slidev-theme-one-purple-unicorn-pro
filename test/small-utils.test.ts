import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { parsePageList } from '../utils/pages.ts'
import { encodeQr, qrPath } from '../utils/qr.ts'
import { richText } from '../utils/rich-text.ts'
import { colorStops, functionArgs, isTransparent, splitList } from '../utils/print-canvas.ts'

describe('parsePageList', () => {
  const list = (v: unknown, max?: number) => [...parsePageList(v, max)]
  it('numbers and ranges', () => assert.deepEqual(list('1, 5, 10-12'), [1, 5, 10, 11, 12]))
  it('an array, en dash, reversed range', () => assert.deepEqual(list([3, '7–6']), [3, 6, 7]))
  it('clamped to 1..max', () => assert.deepEqual(list('0-2, 9, 4-20', 5), [1, 2, 4, 5]))
  it('junk ignored', () => assert.deepEqual(list('a, , 2'), [2]))
  it('nothing', () => { assert.deepEqual(list(undefined), []); assert.deepEqual(list(''), []) })
})

describe('encodeQr', () => {
  it('size = 17 + 4 × version, smallest that fits', () => {
    assert.equal(encodeQr('HELLO', 'M').size, 21)
    assert.equal(encodeQr('x'.repeat(100), 'M').size, 17 + 4 * 6)
  })
  it('finder patterns in three corners', () => {
    const { size, modules } = encodeQr('https://example.com', 'Q')
    const at = (x: number, y: number) => modules[y * size + x]
    for (const [x0, y0] of [[0, 0], [size - 7, 0], [0, size - 7]]) {
      for (let i = 0; i < 7; i++) {
        assert.equal(at(x0 + i, y0), 1); assert.equal(at(x0 + i, y0 + 6), 1)
        assert.equal(at(x0, y0 + i), 1); assert.equal(at(x0 + 6, y0 + i), 1)
      }
      assert.equal(at(x0 + 1, y0 + 1), 0)
      assert.equal(at(x0 + 3, y0 + 3), 1)
    }
  })
  it('too long throws RangeError', () => assert.throws(() => encodeQr('x'.repeat(3000), 'H'), RangeError))
  it('cached: same text and level → same matrix', () => assert.equal(encodeQr('abc', 'L'), encodeQr('abc', 'L')))
  it('qrPath draws one square per dark module', () => {
    const m = encodeQr('abc', 'L')
    const dark = m.modules.reduce((a, b) => a + b, 0)
    const path = qrPath(m, 2)
    assert.ok(path.length > 0)
    assert.ok((path.match(/M/g) ?? []).length <= dark)
  })
})

describe('richText', () => {
  it('escapes HTML', () => assert.equal(richText('<b>&"'), '&lt;b&gt;&amp;&quot;'))
  it('x^2 → superscript', () => assert.equal(richText('O(n^2)'), 'O(n<sup>2</sup>)'))
  it('$…$ → KaTeX', () => assert.match(richText('cost $O(n^2)$'), /^cost <span class="katex">/))
  it('\\$ is a literal dollar', () => assert.equal(richText('\\$5 and \\$6'), '$5 and $6'))
  it('lone $ stays text', () => assert.equal(richText('$5'), '$5'))
  it('null / numbers', () => { assert.equal(richText(null), ''); assert.equal(richText(3), '3') })
})

describe('print-canvas parsing', () => {
  it('splitList at top-level commas', () => assert.deepEqual(splitList('a, f(b, c), d'), ['a', 'f(b, c)', 'd']))
  it('functionArgs', () => assert.deepEqual(functionArgs('linear-gradient(90deg, rgb(1, 2, 3) 10%, blue)'), ['90deg', 'rgb(1, 2, 3) 10%', 'blue']))
  it('colorStops fill missing offsets evenly', () =>
    assert.deepEqual(colorStops(['red', 'green', 'blue 80%', 'white']), [[0, 'red'], [0.4, 'green'], [0.8, 'blue'], [1, 'white']]))
  it('colorStops px and deg', () =>
    assert.deepEqual(colorStops(['red 0px', 'blue 50px'], 100), [[0, 'red'], [0.5, 'blue']]))
  it('isTransparent', () => {
    assert.equal(isTransparent('transparent'), true)
    assert.equal(isTransparent('rgba(0, 0, 0, 0)'), true)
    assert.equal(isTransparent('color(srgb 1 0 0 / 0)'), true)
    assert.equal(isTransparent('rgba(0, 0, 0, 0.5)'), false)
  })
  // getComputedStyle gives opaque black as rgb(0, 0, 0): its last channel is not alpha
  it('isTransparent: opaque colors ending in 0', () => {
    for (const c of ['rgb(0, 0, 0)', 'rgb(255, 255, 0)', 'rgb(255, 0, 0)']) assert.equal(isTransparent(c), false, c)
  })
})
