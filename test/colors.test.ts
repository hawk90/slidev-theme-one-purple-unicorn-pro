import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { COLOR_NAMES, colorValue } from '../utils/colors.ts'

describe('colorValue', () => {
  it('names map to the theme tokens', () => {
    assert.equal(colorValue('primary'), 'var(--primary-400)')
    assert.equal(colorValue('green'), 'var(--one-dark-green)')
    assert.equal(colorValue(' Red '), 'var(--one-dark-red)')
    assert.equal(colorValue('gray'), 'var(--text-muted)')
    for (const name of COLOR_NAMES) assert.match(colorValue(name)!, /^var\(--/)
  })
  it('anything else is a CSS color as given', () => {
    assert.equal(colorValue('#ff6b6b'), '#ff6b6b')
    assert.equal(colorValue('rebeccapurple'), 'rebeccapurple')
    assert.equal(colorValue('magenta'), 'magenta')
  })
  it('empty: undefined', () => {
    assert.equal(colorValue(''), undefined)
    assert.equal(colorValue(undefined), undefined)
    assert.equal(colorValue('  '), undefined)
  })
})
