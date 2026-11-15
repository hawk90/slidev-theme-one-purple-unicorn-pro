import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { sizeAttrs } from '../utils/size.ts'

describe('sizeAttrs', () => {
  it('a preset is a class', () => assert.deepEqual(sizeAttrs('qrcode', 'lg', '--qrcode-size'), { class: 'qrcode-lg', style: undefined }))
  it('empty is the default preset', () => assert.equal(sizeAttrs('countdown', '', '--countdown-size').class, 'countdown-default'))
  it('anything else sets the variable', () => assert.deepEqual(sizeAttrs('countdown', ' 2.5rem ', '--countdown-size'), { class: undefined, style: { '--countdown-size': '2.5rem' } }))
})
