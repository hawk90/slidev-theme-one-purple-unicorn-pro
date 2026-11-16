import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { contactLinks } from '../utils/contact.ts'

describe('contactLinks', () => {
  it('URLs: the site and a short label', () => {
    assert.deepEqual(contactLinks(['https://github.com/hawk90']), [{ kind: 'github', url: 'https://github.com/hawk90', label: 'hawk90' }])
    assert.deepEqual(contactLinks('example.com/talks'), [{ kind: 'web', url: 'https://example.com/talks', label: 'example.com/talks' }])
    assert.equal(contactLinks(['https://x.com/jane'])[0].kind, 'x')
  })
  it('e-mail', () => {
    assert.deepEqual(contactLinks(['jane@example.com']), [{ kind: 'email', url: 'mailto:jane@example.com', label: 'jane@example.com' }])
    assert.equal(contactLinks(['mailto:a@b.co'])[0].url, 'mailto:a@b.co')
  })
  it('{ label, url } and { site: name }', () => {
    assert.deepEqual(contactLinks([{ label: 'Slides', url: 'https://sli.dev' }]), [{ kind: 'web', url: 'https://sli.dev', label: 'Slides' }])
    assert.deepEqual(contactLinks([{ github: 'hawk90', twitter: '@jane' }]), [
      { kind: 'github', url: 'https://github.com/hawk90', label: 'hawk90' },
      { kind: 'x', url: 'https://x.com/jane', label: '@jane' },
    ])
    assert.equal(contactLinks([{ mastodon: '@jane@hachyderm.io' }])[0].url, 'https://hachyderm.io/@jane')
    assert.equal(contactLinks([{ email: 'a@b.co' }])[0].url, 'mailto:a@b.co')
  })
  it('nothing for nothing', () => {
    assert.deepEqual(contactLinks(undefined), [])
    assert.deepEqual(contactLinks(['', null]), [])
  })
})
