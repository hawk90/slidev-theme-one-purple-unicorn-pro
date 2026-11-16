import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { ideFileName, ideOptions, tabWindow } from '../utils/ide.ts'

describe('ideFileName', () => {
  it('a slug of the title, or its own', () => {
    assert.equal(ideFileName('Memory Coalescing 101!', 3), 'memory-coalescing-101.md')
    assert.equal(ideFileName('공유 메모리', 4), '공유-메모리.md')
    assert.equal(ideFileName('', 7), 'slide-7.md')
    assert.equal(ideFileName('X', 1, 'kernel.cu'), 'kernel.cu')
    assert.ok(ideFileName('a very long title that goes on and on and on', 1).length <= 31)
  })
})

describe('tabWindow', () => {
  it('centered on the current slide, clamped to the deck', () => {
    assert.deepEqual(tabWindow(10, 40, 5), [8, 9, 10, 11, 12])
    assert.deepEqual(tabWindow(1, 40, 5), [1, 2, 3, 4, 5])
    assert.deepEqual(tabWindow(40, 40, 5), [36, 37, 38, 39, 40])
    assert.deepEqual(tabWindow(2, 3, 6), [1, 2, 3])
  })
  it('within the current section', () => {
    assert.deepEqual(tabWindow(11, 40, 6, [5, 10, 13]), [10, 11, 12])
    assert.deepEqual(tabWindow(3, 40, 6, [5, 10]), [1, 2, 3, 4])
    assert.deepEqual(tabWindow(20, 40, 4, [5, 10, 13]), [19, 20, 21, 22])
  })
})

describe('ideOptions', () => {
  it('true, an object, or off', () => {
    assert.deepEqual(ideOptions(true, 'me/talk'), { repo: 'me/talk', branch: 'main', language: 'Markdown' })
    assert.deepEqual(ideOptions({ branch: 'dev' }), { repo: '', branch: 'dev', language: 'Markdown' })
    assert.equal(ideOptions(false), null)
    assert.equal(ideOptions(undefined), null)
  })
})
