import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { advanceDelay } from '../utils/auto-advance.ts'

describe('advanceDelay', () => {
  it('the slide\'s own, else the deck\'s', () => {
    assert.equal(advanceDelay(undefined, '8s'), 8000)
    assert.equal(advanceDelay('20s', '8s'), 20000)
    assert.equal(advanceDelay(5, undefined), 5000)
    assert.equal(advanceDelay(undefined, '1m'), 60000)
    assert.equal(advanceDelay(undefined, '0:30'), 30000)
  })
  it('false on a slide stops there; none or junk: off', () => {
    assert.equal(advanceDelay(false, '8s'), null)
    assert.equal(advanceDelay('false', '8s'), null)
    assert.equal(advanceDelay(undefined, undefined), null)
    assert.equal(advanceDelay(undefined, 'soon'), null)
  })
  it('never faster than half a second', () => {
    assert.equal(advanceDelay(0.1, undefined), 500)
  })
})
