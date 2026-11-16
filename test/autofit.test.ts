import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { fitScale, hasAutofitAddon } from '../utils/autofit.ts'

describe('fitScale', () => {
  it('1 when it fits; the ratio when not; never below the floor', () => {
    assert.equal(fitScale(500, 400), 1)
    assert.equal(fitScale(500, 1000), 0.5)
    assert.equal(fitScale(500, 750), 0.66)
    assert.equal(fitScale(100, 1000), 0.42)
    assert.equal(fitScale(500, 0), 1)
  })
})

describe('hasAutofitAddon', () => {
  it('the addon by its names', () => {
    assert.ok(hasAutofitAddon(['slidev-addon-autofit']))
    assert.ok(hasAutofitAddon(['autofit']))
    assert.ok(!hasAutofitAddon(['slidev-addon-qrcode']))
    assert.ok(!hasAutofitAddon(undefined))
  })
})
