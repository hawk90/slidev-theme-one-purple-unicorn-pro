import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { wipLabel } from '../utils/authoring.ts'

describe('wipLabel', () => {
  it('a slide\'s own, else the deck\'s', () => {
    assert.equal(wipLabel(true, undefined), 'WIP')
    assert.equal(wipLabel('Draft', undefined), 'Draft')
    assert.equal(wipLabel(undefined, true), 'WIP')
    assert.equal(wipLabel(false, true), '')
    assert.equal(wipLabel(undefined, undefined), '')
    assert.equal(wipLabel('false', undefined), '')
  })
})
