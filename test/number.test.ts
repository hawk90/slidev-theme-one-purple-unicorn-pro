import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { durationMs, formatNumber, parseNumber } from '../utils/number.ts'

describe('parseNumber', () => {
  it('prefix, value, suffix, decimals, grouping', () => {
    assert.deepEqual(parseNumber('$4.2M'), { prefix: '$', value: 4.2, suffix: 'M', decimals: 1, grouping: false })
    assert.deepEqual(parseNumber('98.5%'), { prefix: '', value: 98.5, suffix: '%', decimals: 1, grouping: false })
    assert.deepEqual(parseNumber('1,024'), { prefix: '', value: 1024, suffix: '', decimals: 0, grouping: true })
    assert.deepEqual(parseNumber('+12%'), { prefix: '+', value: 12, suffix: '%', decimals: 0, grouping: false })
    assert.deepEqual(parseNumber('-3.25 ms'), { prefix: '', value: -3.25, suffix: ' ms', decimals: 2, grouping: false })
    assert.deepEqual(parseNumber('~1,234,567.89 users'), { prefix: '~', value: 1234567.89, suffix: ' users', decimals: 2, grouping: true })
  })
  it('numbers', () => {
    assert.deepEqual(parseNumber(42), { prefix: '', value: 42, suffix: '', decimals: 0, grouping: false })
    assert.deepEqual(parseNumber(0.5), { prefix: '', value: 0.5, suffix: '', decimals: 1, grouping: false })
    assert.equal(parseNumber(Number.NaN), null)
  })
  it('no digits: null', () => {
    assert.equal(parseNumber('N/A'), null)
    assert.equal(parseNumber(''), null)
  })
  it('the first number only; a comma not in groups of three is text', () => {
    assert.deepEqual(parseNumber('v2.0.1'), { prefix: 'v', value: 2, suffix: '.1', decimals: 1, grouping: false })
    assert.equal(parseNumber('12,34')?.value, 12)
    assert.equal(parseNumber('1,0245')?.value, 1)
  })
})

describe('durationMs', () => {
  it('s and ms; fallback when unset or not positive', () => {
    assert.equal(durationMs('1.2s', 500), 1200)
    assert.equal(durationMs(' 800ms ', 500), 800)
    assert.equal(durationMs('', 500), 500)
    assert.equal(durationMs('0s', 500), 500)
    assert.equal(durationMs('fast', 500), 500)
  })
})

describe('formatNumber', () => {
  const like = (s: string) => parseNumber(s)!
  it('round trip', () => {
    for (const s of ['$4.2M', '98.5%', '1,024', '+12%', '-3.25 ms', '~1,234,567.89 users', '0'])
      assert.equal(formatNumber(like(s).value, like(s)), s)
  })
  it('other values in the same form (count-up)', () => {
    assert.equal(formatNumber(0, like('$4.2M')), '$0.0M')
    assert.equal(formatNumber(512.4, like('1,024')), '512')
    assert.equal(formatNumber(1234.5, like('1,024')), '1,235')
    assert.equal(formatNumber(-0.01, like('-3.5')), '0.0')
    assert.equal(formatNumber(-1.25, like('-3.5')), '-1.3')
  })
})
