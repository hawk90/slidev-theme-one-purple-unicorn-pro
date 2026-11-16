import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { slideAnnouncement } from '../utils/a11y.ts'

describe('slideAnnouncement', () => {
  it('number, total and title', () => {
    assert.equal(slideAnnouncement(3, 20, 'Memory <b>Coalescing</b>'), 'Slide 3 of 20: Memory Coalescing')
    assert.equal(slideAnnouncement(1, 20, ''), 'Slide 1 of 20')
    assert.equal(slideAnnouncement(1, 20), 'Slide 1 of 20')
  })
})
