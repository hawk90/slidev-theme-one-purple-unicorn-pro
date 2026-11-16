import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { bareUrl, printedUrl } from '../utils/print-links.ts'

describe('printedUrl', () => {
  it('a link with words prints its address', () => {
    assert.equal(printedUrl('the docs', 'https://sli.dev/guide/'), 'sli.dev/guide')
    assert.equal(printedUrl('Mail me', 'mailto:a@b.dev'), 'a@b.dev')
  })
  it('none when the text is the address', () => {
    assert.equal(printedUrl('sli.dev/guide', 'https://sli.dev/guide/'), '')
    assert.equal(printedUrl('https://www.example.com', 'https://example.com'), '')
    assert.equal(printedUrl('a@b.dev', 'mailto:a@b.dev'), '')
    assert.equal(printedUrl('example.com ↗', 'https://example.com'), '')
    assert.equal(printedUrl('↗ https://sli.dev', 'https://sli.dev'), '')
    assert.equal(printedUrl('web npmjs.com/package/x', 'https://www.npmjs.com/package/x'), '')
  })
  it('none for in-deck links and empty text', () => {
    assert.equal(printedUrl('Slide 3', '/3'), '')
    assert.equal(printedUrl('Top', '#top'), '')
    assert.equal(printedUrl('  ', 'https://x.dev'), '')
  })
})

describe('bareUrl', () => {
  it('drops the scheme, www and trailing slashes', () => {
    assert.equal(bareUrl('https://www.github.com/a/b//'), 'github.com/a/b')
  })
})
