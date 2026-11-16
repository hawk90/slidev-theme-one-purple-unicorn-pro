import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { cleanSlide, deckText, handoutHtml } from '../utils/handout.ts'

describe('cleanSlide', () => {
  it('drops components, comments and tags, keeps text and code', () => {
    const md = '# T\n\n<!-- note -->\n<div class="grid">\n\n- **one** {{ $x }}\n\n</div>\n\n<Chart :data="[1]" />\n\n::left::\n\n```html\n<div>kept</div>\n```'
    assert.equal(cleanSlide(md), '# T\n\n- **one**\n\n```html\n<div>kept</div>\n```')
    assert.equal(cleanSlide('`<ClickTabs>`: tabs'), '`<ClickTabs>`: tabs')
  })
})

describe('deckText', () => {
  const slides = [
    { no: 1, title: 'Talk', content: '# Talk', note: '', hidden: false },
    { no: 2, title: 'Coalescing', content: '# Coalescing\n\nReads in a row.', note: 'Say why.\nThen show.', hidden: false },
    { no: 4, title: 'Sub', content: '# Sub\n\n## Part\n\n```sh\n# a shell comment\n```', note: '', hidden: false },
    { no: 3, title: 'Secret', content: '# Secret', note: '', hidden: true },
  ]
  it('titles, text and notes; hidden slides left out', () => {
    assert.equal(deckText(slides, { title: 'Talk', author: 'Jane', event: 'Meetup' }),
      '# Talk\n\n> Jane · Meetup\n\n## 1. Talk\n\n## 2. Coalescing\n\nReads in a row.\n\nNotes: Say why. Then show.\n\n## 4. Sub\n\n### Part\n\n```sh\n# a shell comment\n```\n')
  })
  it('a page linking each section to its slide', () => {
    const html = handoutHtml(slides, { title: 'A <b>talk</b>' }, md => `<p>${md}</p>`, '/deck/')
    assert.ok(html.includes('<title>A &lt;b&gt;talk&lt;/b&gt; · handout</title>'))
    assert.ok(html.includes('<h2><a href="/deck/2">2</a> Coalescing</h2><p>Reads in a row.</p><aside class="note"><p>Say why.\nThen show.</p></aside>'))
    assert.ok(!html.includes('Secret'))
  })
})
