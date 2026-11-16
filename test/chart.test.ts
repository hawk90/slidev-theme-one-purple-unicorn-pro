import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { niceScale, radarPoints, shortNumber, toSeries } from '../utils/chart.ts'

describe('chart helpers', () => {
  it('niceScale', () => {
    assert.deepEqual(niceScale(87), { top: 100, step: 20 })
    assert.deepEqual(niceScale(12.8), { top: 15, step: 5 })
    assert.deepEqual(niceScale(2039), { top: 2500, step: 500 })
    assert.deepEqual(niceScale(0), { top: 1, step: 0.25 })
  })
  it('toSeries', () => {
    assert.deepEqual(toSeries([1, '2', 3]), [{ name: '', values: [1, 2, 3] }])
    assert.deepEqual(toSeries([{ name: 'a', values: [1], color: 'cyan' }]), [{ name: 'a', values: [1], color: 'cyan' }])
    assert.deepEqual(toSeries(undefined), [])
  })
  it('radarPoints: clockwise from the top', () => {
    assert.deepEqual(radarPoints([1, 1, 1, 1], 1, 10), [[0, -10], [10, 0], [0, 10], [-10, 0]])
    assert.deepEqual(radarPoints([2, 0], 1, 10)[0], [0, -10])
  })
  it('shortNumber', () => {
    assert.deepEqual([12, 1200, 2500000, 3e9, 0.125].map(shortNumber), ['12', '1.2k', '2.5M', '3G', '0.13'])
  })
})
