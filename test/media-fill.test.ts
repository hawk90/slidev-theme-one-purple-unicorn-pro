import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { isVideo, mediaList, mediaWidth, wallColumns } from '../utils/media.ts'

describe('wallColumns', () => {
  it('even rows for each count', () => {
    assert.deepEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 20, 40].map(n => wallColumns(n)), [1, 2, 3, 4, 3, 3, 4, 4, 3, 4, 4, 5, 6, 6])
    assert.equal(wallColumns(0), 1)
    assert.equal(wallColumns(30, 8), 8)
  })
})

describe('isVideo / mediaList / mediaWidth', () => {
  it('videos by extension', () => {
    assert.ok(isVideo('/clip.mp4'))
    assert.ok(isVideo('https://x.com/a.webm?t=1'))
    assert.ok(!isVideo('/a.png'))
  })
  it('one or up to three', () => {
    assert.deepEqual(mediaList('/a.png'), ['/a.png'])
    assert.deepEqual(mediaList(['/a', '/b', '', '/c', '/d']), ['/a', '/b', '/c'])
    assert.deepEqual(mediaList(undefined), [])
  })
  it('widths', () => {
    assert.equal(mediaWidth(undefined), '50%')
    assert.equal(mediaWidth('40%'), '40%')
    assert.equal(mediaWidth(0.4), '40%')
    assert.equal(mediaWidth('2/5'), '40%')
    assert.equal(mediaWidth('1/3'), '33.3%')
    assert.equal(mediaWidth('30rem'), '30rem')
    assert.equal(mediaWidth('wide'), '50%')
  })
})
