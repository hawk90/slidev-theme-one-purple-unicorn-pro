import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { stageOf, stagesOf, stageTarget } from '../utils/stages.ts'

describe('stageTarget', () => {
  const S = ['A', 'B']
  const slides = [
    { no: 1, frontmatter: {} },
    { no: 2, frontmatter: { stages: S, currentStage: 0, routeAlias: 'intro' } },
    { no: 3, frontmatter: { title: 'inserted later' } },
    { no: 4, frontmatter: { stages: S, currentStage: 1, routeAlias: 'deep' } },
  ]
  it('no stageMap: first slide with these stages at that stage', () => {
    assert.deepEqual(stageTarget(1, S, undefined, slides), { no: 4 })
  })
  it('page numbers and routeAlias names', () => {
    assert.deepEqual(stageTarget(1, S, [2, 4], slides), { no: 4 })
    assert.deepEqual(stageTarget(1, S, ['intro', 'deep'], slides), { no: 4 })
  })
  it('a stale page number: warns, goes to the real stage', () => {
    const r = stageTarget(1, S, [2, 3], slides)
    assert.equal(r.no, 4)
    assert.match(r.warning!, /slide 3, which is not stage 1/)
  })
  it('past the end or unknown alias: warns, auto-detects', () => {
    assert.equal(stageTarget(0, S, [99], slides).no, 2)
    assert.match(stageTarget(0, S, ['nope'], slides).warning!, /no such slide/)
  })
  it('a mapped slide off the stages, with no auto match: still goes there', () => {
    assert.deepEqual(stageTarget(1, ['X', 'Y'], [1, 3], slides), { no: 3 })
  })
})

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
