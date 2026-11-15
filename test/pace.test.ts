import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { durationSeconds, pace, timerElapsed } from '../utils/pace.ts'

describe('durationSeconds', () => {
  it('reads what Slidev reads', () => {
    assert.equal(durationSeconds('30min'), 1800)
    assert.equal(durationSeconds('1h15m'), 4500)
    assert.equal(durationSeconds('90s'), 90)
    assert.equal(durationSeconds('2mins 30secs'), 150)
    assert.equal(durationSeconds('10:30'), 630)
    assert.equal(durationSeconds('1:00:00'), 3600)
    assert.equal(durationSeconds(600), 600)
    assert.equal(durationSeconds('600'), 600)
  })
  it('null for junk, zero, empty', () => {
    for (const v of [undefined, '', 'soon', '5 parsecs', 0, '0min', 'a:b'])
      assert.equal(durationSeconds(v), null, String(v))
  })
})

describe('pace', () => {
  it('on pace within the slack, then behind, then late', () => {
    assert.deepEqual(pace(15 * 60_000, 1800, 50), { percent: 50, state: 'on' })
    assert.deepEqual(pace(15 * 60_000, 1800, 46), { percent: 50, state: 'on' })
    assert.equal(pace(15 * 60_000, 1800, 40).state, 'behind')
    assert.equal(pace(15 * 60_000, 1800, 30).state, 'late')
  })
  it('ahead of time is on pace; the marker stops at the end', () => {
    assert.equal(pace(60_000, 1800, 80).state, 'on')
    assert.equal(pace(40 * 60_000, 1800, 100).percent, 100)
  })
})

describe('timerElapsed', () => {
  it('stopped, running, paused', () => {
    assert.equal(timerElapsed({ status: 'stopped', startedAt: 5 }, 100), 0)
    assert.equal(timerElapsed({ status: 'running', startedAt: 40 }, 100), 60)
    assert.equal(timerElapsed({ status: 'paused', startedAt: 40, pausedAt: 70 }, 100), 30)
    assert.equal(timerElapsed(undefined, 100), 0)
  })
})
