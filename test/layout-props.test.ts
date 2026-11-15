import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { centeredLayoutProps, columnLayoutProps } from '../utils/layout-props.ts'

describe('columnLayoutProps', () => {
  it('two columns: width, label, label color per column, and the divider', () => {
    assert.deepEqual(Object.keys(columnLayoutProps(['left', 'right'])).sort(), [
      'divider', 'leftLabel', 'leftLabelColor', 'leftWidth', 'rightLabel', 'rightLabelColor', 'rightWidth',
    ])
  })
  it('three columns add the center ones', () => {
    assert.equal(Object.keys(columnLayoutProps(['left', 'center', 'right'])).length, 10)
  })
  it('defaults: 1fr widths, empty labels, no divider', () => {
    const p = columnLayoutProps(['left'])
    assert.equal(p.leftWidth.default, '1fr')
    assert.deepEqual(p.leftWidth.type, [String, Number])
    assert.equal(p.leftLabel.default, '')
    assert.equal(p.divider.default, false)
  })
  it('each call gets its own objects (Vue mutates nothing, but no sharing)', () => {
    assert.notEqual(columnLayoutProps(['left']).leftWidth, columnLayoutProps(['left']).leftWidth)
  })
})

describe('centeredLayoutProps', () => {
  it('padding and content width with defaults', () => {
    const p = centeredLayoutProps('48rem')
    assert.equal(p.contentMaxWidth.default, '48rem')
    assert.equal(p.padding.default, '4rem 6rem')
  })
})
