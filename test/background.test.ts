import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { backgroundKind, opacityOf, parallaxProgress, patternOf, scrimOf } from '../utils/background.ts'

describe('backgroundKind', () => {
  it('colors', () => {
    for (const v of ['#123', '#112233', 'rgb(1 2 3)', 'hsl(200 50% 40%)', 'oklch(0.6 0.2 300)', 'var(--primary-600)', 'navy', 'transparent', 'color-mix(in srgb, red 20%, blue)'])
      assert.equal(backgroundKind(v), 'color', v)
  })
  it('gradients', () => {
    for (const v of ['linear-gradient(135deg, #000, #333)', 'radial-gradient(circle, red, blue)', 'repeating-conic-gradient(red 0 10%, blue 0 20%)'])
      assert.equal(backgroundKind(v), 'gradient', v)
  })
  it('images', () => {
    for (const v of ['/bg.jpg', 'https://example.com/a.png', 'images/photo.webp', 'bg.svg'])
      assert.equal(backgroundKind(v), 'image', v)
  })
})

describe('opacityOf', () => {
  it('numbers and percentages, clamped', () => {
    assert.equal(opacityOf(0.4), 0.4)
    assert.equal(opacityOf('60%'), 0.6)
    assert.equal(opacityOf(2), 1)
    assert.equal(opacityOf(-1), 0)
    assert.equal(opacityOf(undefined), null)
    assert.equal(opacityOf('dim'), null)
  })
})

describe('patternOf', () => {
  it('the five patterns, any case', () => {
    assert.equal(patternOf('mesh'), 'mesh')
    assert.equal(patternOf(' Aurora '), 'aurora')
    assert.equal(patternOf('stripes'), null)
    assert.equal(patternOf(undefined), null)
  })
})

describe('scrimOf', () => {
  it('on for images by default, off otherwise; false, true and a strength', () => {
    assert.equal(scrimOf(undefined, 'image'), 0.55)
    assert.equal(scrimOf(undefined, 'color'), null)
    assert.equal(scrimOf(undefined, null), null)
    assert.equal(scrimOf(false, 'image'), null)
    assert.equal(scrimOf(true, 'gradient'), 0.55)
    assert.equal(scrimOf('30%', 'image'), 0.3)
    assert.equal(scrimOf(0.8, 'color'), 0.8)
  })
})

describe('parallaxProgress', () => {
  it('runs of the same image, each 0 → 1', () => {
    const srcs = ['a', 'a', 'a', null, 'b', 'b', 'c']
    assert.deepEqual(srcs.map((_, i) => parallaxProgress(srcs, i)), [0, 0.5, 1, 0, 0, 1, 0.5])
  })
})
