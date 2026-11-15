import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { progressMode, progressPercent } from '../utils/progress.ts'
import { footerSetting } from '../utils/talk-info.ts'

describe('progressMode', () => {
  it('default always; content; off (false or "false")', () => {
    assert.equal(progressMode(undefined), 'always')
    assert.equal(progressMode('content'), 'content')
    assert.equal(progressMode(false), 'off')
    assert.equal(progressMode('false'), 'off')
  })
})

describe('progressPercent', () => {
  it('first 0, last 100', () => {
    assert.equal(progressPercent(1, 5), 0)
    assert.equal(progressPercent(5, 5), 100)
    assert.equal(progressPercent(3, 5), 50)
  })
  it('a single slide: 0', () => assert.equal(progressPercent(1, 1), 0))
  it('skipped pages count unless excluded', () => {
    assert.equal(progressPercent(4, 5, [2], false), 75)
    assert.equal(progressPercent(4, 5, [2], true), 2 / 3 * 100)
  })
})

describe('footerSetting', () => {
  it("a slide's own value wins", () => {
    assert.equal(footerSetting(false, true), false)
    assert.deepEqual(footerSetting(['title'], true), ['title'])
  })
  it("own true keeps the deck's list", () => assert.deepEqual(footerSetting(true, ['event']), ['event']))
  it("none: the deck's, except on media layouts", () => {
    assert.equal(footerSetting(undefined, true), true)
    assert.equal(footerSetting(undefined, true, true), undefined)
    assert.equal(footerSetting(true, true, true), true)
  })
})
