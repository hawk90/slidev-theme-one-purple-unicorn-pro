import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { backgroundImageStyle } from '../utils/media.ts'

describe('backgroundImageStyle', () => {
  it('no picture: no style', () => assert.deepEqual(backgroundImageStyle(''), {}))
  it('cover, centered, no repeat by default', () => {
    assert.deepEqual(backgroundImageStyle('/a.png'), {
      backgroundImage: 'url("/a.png")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
    })
  })
  it('the url is quoted (spaces, parentheses, quotes)', () => {
    assert.equal(backgroundImageStyle('/my pic (1)".png').backgroundImage, 'url("/my pic (1)\\".png")')
  })
  it('size and position pass through', () => {
    const s = backgroundImageStyle('/a.png', 'contain', 'top left')
    assert.equal(s.backgroundSize, 'contain')
    assert.equal(s.backgroundPosition, 'top left')
  })
})
