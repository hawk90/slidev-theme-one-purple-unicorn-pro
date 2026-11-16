import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { layoutNeedsAlt, picturesWithoutAlt } from '../utils/alt-lint.ts'

describe('picturesWithoutAlt', () => {
  it('markdown and html pictures with no alt', () => {
    assert.deepEqual(picturesWithoutAlt('![](/a.png) ![ok](/b.png)\n<img src="/c.png"> <img src="/d.png" alt=""> <img :src="pic" :alt="t">'), ['/a.png', '/c.png'])
  })
  it('code blocks are examples', () => {
    assert.deepEqual(picturesWithoutAlt('```md\n![](/a.png)\n```'), [])
  })
})

describe('layoutNeedsAlt', () => {
  it('image layouts with a picture and no alt', () => {
    assert.equal(layoutNeedsAlt({ layout: 'image', image: '/a.png' }), true)
    assert.equal(layoutNeedsAlt({ layout: 'full-image', image: '/a.png', alt: '' }), false)
    assert.equal(layoutNeedsAlt({ layout: 'default', image: '/a.png' }), false)
  })
})
