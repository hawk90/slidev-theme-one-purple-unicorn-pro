import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { benchmarkRows } from '../utils/benchmark.ts'

describe('benchmarkRows', () => {
  it('times: the smallest wins, ratios against the first', () => {
    const rows = benchmarkRows([{ label: 'naive', value: 12.8 }, { label: 'tiled', value: 3.2 }, { label: 'tc', value: 1.6 }], true, 'ms')
    assert.deepEqual(rows.map(r => r.winner), [false, false, true])
    assert.deepEqual(rows.map(r => r.ratio), ['base', '4×', '8×'])
    assert.deepEqual(rows.map(r => r.text), ['12.8 ms', '3.2 ms', '1.6 ms'])
    assert.equal(rows[0].share, 1)
    assert.equal(rows[2].share, 0.125)
  })
  it('rates: the biggest wins', () => {
    const rows = benchmarkRows([{ label: 'a', value: 200 }, { label: 'b', value: 800 }], false, 'GB/s')
    assert.deepEqual(rows.map(r => r.winner), [false, true])
    assert.equal(rows[1].ratio, '4×')
  })
  it('junk values: no bar, no winner among one', () => {
    const rows = benchmarkRows([{ label: 'a', value: Number.NaN }, { label: 'b', value: 5 }])
    assert.equal(rows[0].text, '—')
    assert.equal(rows[1].winner, false)
  })
})
