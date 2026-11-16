import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { newStructure, structureSlide } from '../utils/structure.ts'

function run(slides: [string, Record<string, any>][]) {
  const st = newStructure()
  return slides.map(([c, fm]) => ({ content: structureSlide(st, c, fm) ?? c, fm }))
}

describe('structureSlide', () => {
  it('sections, their metadata and transitions', () => {
    const r = run([
      ['# Talk', {}],
      ['# Intro', {}],
      ['# Memory', { layout: 'section' }],
      ['# Coalescing', {}],
      ['# Own', { transition: 'fade' }],
      ['# Next', { chapter: 'Compute' }],
    ])
    assert.deepEqual(r[0].fm, {})
    assert.deepEqual(r[1].fm, { transition: 'slide-up' })
    assert.deepEqual(r[2].fm, { layout: 'section', section: 'Memory', sectionNo: 1, transition: 'slide-left' })
    assert.deepEqual(r[3].fm, { section: 'Memory', sectionNo: 1, transition: 'slide-up' })
    assert.equal(r[4].fm.transition, 'fade')
    assert.deepEqual([r[5].fm.section, r[5].fm.sectionNo, r[5].fm.transition], ['Compute', 2, 'slide-left'])
  })
  it('a continued slide carries the last title over', () => {
    const r = run([
      ['# Talk', {}],
      ['# Coalescing\n\ntext', {}],
      ['more', { continued: true }],
      ['still more', { continued: '(계속)' }],
      ['# Own title', { continued: true }],
    ])
    assert.equal(r[2].content, '# Coalescing (cont.)\n\nmore')
    assert.equal(r[2].fm.title, 'Coalescing (cont.)')
    assert.equal(r[3].content, '# Coalescing (계속)\n\nstill more')
    assert.equal(r[4].content, '# Own title')
  })
  it('a heading inside a code block is not a title', () => {
    const r = run([['# Talk', {}], ['# Real', {}], ['```md\n# Fake\n```', { continued: true }]])
    assert.ok(r[2].content.startsWith('# Real (cont.)'))
  })
})
