import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { stageOf, stagesOf } from '../utils/stages.ts'

describe('stageOf', () => {
  it('numbers and numeric strings', () => {
    assert.equal(stageOf({ currentStage: 0 }), 0)
    assert.equal(stageOf({ currentStage: 2 }), 2)
    assert.equal(stageOf({ currentStage: '3' }), 3)
  })
  it('unset or empty is not the first stage', () => {
    for (const currentStage of [undefined, null, '', false, true])
      assert.equal(stageOf({ currentStage }), -1, String(currentStage))
    assert.equal(stageOf({}), -1)
  })
  it('junk, fractions and negatives', () => {
    for (const currentStage of ['two', 1.5, -1, Number.NaN])
      assert.equal(stageOf({ currentStage }), -1, String(currentStage))
  })
})

describe('stagesOf', () => {
  it('a list, as strings', () => assert.deepEqual(stagesOf({ stages: ['A', 2] }), ['A', '2']))
  it('anything else: none', () => {
    assert.deepEqual(stagesOf({ stages: 'A, B' }), [])
    assert.deepEqual(stagesOf({}), [])
  })
})
