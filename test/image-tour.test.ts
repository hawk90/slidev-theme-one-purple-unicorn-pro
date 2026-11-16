import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { tourZoom } from '../utils/image-tour.ts'

describe('tourZoom', () => {
  it('fills the frame with the spot, centered', () => {
    assert.deepEqual(tourZoom({ x: 0.5, y: 0.5, w: 0.5, h: 0.5 }), { transform: 'translate(-50%, -50%) scale(2)' })
  })
  it('stays inside the image at the edges', () => {
    assert.deepEqual(tourZoom({ x: 0.1, y: 0.9, w: 0.25, h: 0.25 }), { transform: 'translate(0%, -300%) scale(4)' })
  })
  it('never zooms out, and caps the zoom', () => {
    assert.deepEqual(tourZoom({ x: 0.5, y: 0.5, w: 1, h: 1 }), { transform: 'translate(0%, 0%) scale(1)' })
    assert.equal(tourZoom({ x: 0.5, y: 0.5, w: 0.01, h: 0.01 }).transform.endsWith('scale(4)'), true)
  })
})
