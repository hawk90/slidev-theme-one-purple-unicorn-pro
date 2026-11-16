import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { formEmbedUrl, formShortLink } from '../utils/google-form.ts'

describe('google forms', () => {
  it('embed addresses', () => {
    assert.equal(formEmbedUrl('https://docs.google.com/forms/d/e/1FAIpQ/viewform'), 'https://docs.google.com/forms/d/e/1FAIpQ/viewform?embedded=true')
    assert.equal(formEmbedUrl('https://docs.google.com/forms/d/e/1FAIpQ/viewform?usp=sf_link'), 'https://docs.google.com/forms/d/e/1FAIpQ/viewform?usp=sf_link&embedded=true')
    assert.equal(formEmbedUrl('https://docs.google.com/forms/d/abc/edit'), 'https://docs.google.com/forms/d/abc/viewform?embedded=true')
    assert.equal(formEmbedUrl('https://forms.gle/xyz'), 'https://forms.gle/xyz')
  })
  it('short links', () => {
    assert.equal(formShortLink('https://forms.gle/AbCd123'), 'forms.gle/AbCd123')
    assert.equal(formShortLink('https://docs.google.com/forms/d/e/1FAIpQLSexampleexampleexample/viewform?usp=x'), 'docs.google.com/forms/…e/viewform')
  })
})
