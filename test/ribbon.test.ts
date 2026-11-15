import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { ribbonOf, ribbonScale } from '../utils/ribbon.ts'

describe('ribbonOf', () => {
  it('off unless the deck asks', () => {
    for (const v of [undefined, null, false, 'false', ''])
      assert.equal(ribbonOf(v, undefined, undefined, 'default'), null)
  })
  it('true, a label, an object', () => {
    assert.deepEqual(ribbonOf(true, undefined, undefined, 'default'), { label: 'CONFIDENTIAL', company: '', position: 'top-right', labelScale: 1, companyScale: 1 })
    assert.equal(ribbonOf('대외비', undefined, undefined, 'default')?.label, '대외비')
    assert.deepEqual(ribbonOf({ label: 'INTERNAL', company: 'ACME Corp', position: 'top-left' }, undefined, undefined, 'default'),
      { label: 'INTERNAL', company: 'ACME Corp', position: 'top-left', labelScale: 1, companyScale: 1 })
    assert.equal(ribbonOf({ position: 'middle' }, undefined, undefined, 'default')?.position, 'top-right')
  })
  it('a slide turns it off; the first slide can\'t (its frontmatter is the deck\'s)', () => {
    assert.equal(ribbonOf(true, undefined, false, 'default'), null)
    assert.equal(ribbonOf(true, undefined, 'false', 'default'), null)
    assert.notEqual(ribbonOf(true, undefined, true, 'cover', true), null)
  })
  it('a slide of its own: on without the deck, its own label, true keeps the deck\'s', () => {
    assert.equal(ribbonOf(undefined, undefined, true, 'default')?.label, 'CONFIDENTIAL')
    assert.equal(ribbonOf(undefined, undefined, 'WIP', 'default')?.label, 'WIP')
    assert.equal(ribbonOf({ label: 'INTERNAL', company: 'ACME' }, undefined, true, 'default')?.company, 'ACME')
    assert.equal(ribbonOf(true, 'openers', 'DRAFT', 'default')?.label, 'DRAFT')
  })
  it('openers only', () => {
    assert.equal(ribbonOf(true, 'openers', undefined, 'default'), null)
    for (const l of ['cover', 'intro', 'section', 'end'])
      assert.notEqual(ribbonOf(true, 'openers', undefined, l), null)
  })
})

describe('ribbonScale', () => {
  it('full size when it fits, smaller for long text, never below the minimum', () => {
    assert.equal(ribbonScale('CONFIDENTIAL', 13), 1)
    assert.equal(ribbonScale('STRICTLY CONFIDENTIAL', 13), 0.7)
    assert.equal(ribbonScale('STRICTLY CONF', 13), 1)
    assert.equal(ribbonScale('Slidev Theme Lab Platform', 22), 0.88)
    assert.equal(ribbonScale('X'.repeat(80), 22), 0.7)
    assert.equal(ribbonScale('', 22), 1)
  })
})
