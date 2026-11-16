import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { componentTags, lintSlides, nearMiss } from '../bin/lint-core.mjs'

const manifest = {
  layouts: { 'two-cols': { props: { leftWidth: {}, rightWidth: {}, divider: {} } } },
  components: { Chart: { props: { data: { required: true }, type: {}, labels: {} } } },
}

describe('lintSlides', () => {
  it('unknown layouts are errors, with a hint', () => {
    const r = lintSlides([{ no: 2, frontmatter: { layout: 'two-col' } }], manifest)
    assert.deepEqual(r, [{ no: 2, level: 'error', message: 'layout "two-col" doesn\'t exist (did you mean "two-cols"?)' }])
    assert.deepEqual(lintSlides([{ no: 1, frontmatter: { layout: 'image-left' } }], manifest), [])
  })
  it('near-miss frontmatter keys warn; other keys are the deck\'s business', () => {
    const r = lintSlides([{ no: 3, frontmatter: { layout: 'two-cols', leftWith: '2fr', clicks: 2 } }], manifest)
    assert.deepEqual(r.map(p => p.message), ['`leftWith:` isn\'t a prop of layout two-cols (did you mean `leftWidth`?)'])
  })
  it('components: a missing required prop, a near-miss attribute, an unknown name', () => {
    const r = lintSlides([{ no: 4, content: '<Chart tpye="line" class="w-1/2" />\n<Chrt :data="[1]" />\n<Toc />\n<MyThing />' }], manifest, new Set(['MyThing']))
    assert.deepEqual(r.map(p => `${p.level}: ${p.message}`), [
      'error: <Chart> needs `data`',
      'warning: <Chart tpye>: no such prop (did you mean `type`?)',
      'warning: <Chrt> is no component of the theme or Slidev (did you mean <Chart>?)',
    ])
  })
  it('code is an example, not a use', () => {
    assert.deepEqual(lintSlides([{ no: 5, content: '```vue\n<Chart />\n```\n`<Chart />`' }], manifest), [])
  })
})

describe('helpers', () => {
  it('nearMiss and componentTags', () => {
    assert.equal(nearMiss('dividr', ['divider', 'labels']), 'divider')
    assert.equal(nearMiss('xyz', ['divider']), '')
    assert.deepEqual(componentTags('<Chart :data="d" v-click type=bar />'), [{ name: 'Chart', attrs: ['data', 'v-click', 'type'] }])
  })
})
