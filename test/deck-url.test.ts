import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { deckUrl, isPublicHost, isSafeTarget } from '../utils/deck-url.ts'

describe('isPublicHost', () => {
  it('this machine is not', () => {
    for (const h of ['localhost', 'app.localhost', '127.0.0.1', '127.8.8.8', '0.0.0.0', '[::1]', '::1', '::'])
      assert.equal(isPublicHost(h), false, h)
  })
  it('private, link-local and mDNS are not', () => {
    for (const h of ['10.0.0.5', '172.16.0.1', '172.31.255.1', '192.168.1.20', '169.254.1.1', 'mac.local', 'fd12::1', 'fe80::1'])
      assert.equal(isPublicHost(h), false, h)
  })
  it('public hosts are', () => {
    for (const h of ['example.com', 'user.github.io', '8.8.8.8', '172.15.0.1', '172.32.0.1', '2001:db8::1'])
      assert.equal(isPublicHost(h), true, h)
  })
  it('empty is not', () => assert.equal(isPublicHost(''), false))
})

describe('isSafeTarget', () => {
  it('refuses script and data schemes', () => {
    for (const t of ['javascript:alert(1)', ' JavaScript:x', 'data:text/html,x', 'vbscript:x', 'file:///etc/passwd'])
      assert.equal(isSafeTarget(t), false, t)
  })
  it('keeps links and plain text', () => {
    for (const t of ['https://example.com', 'mailto:a@b.c', 'WIFI:S:net;T:WPA;P:pw;;', 'hello'])
      assert.equal(isSafeTarget(t), true, t)
  })
})

describe('deckUrl', () => {
  const local = { origin: 'http://localhost:3031', base: '/' }
  const pub = { origin: 'https://user.github.io', base: '/talk/' }
  it('dev server and export: none', () => {
    assert.equal(deckUrl(local), null)
    assert.equal(deckUrl({ origin: 'http://[::1]:3031', base: '/' }), null)
    assert.equal(deckUrl({ ...local, slide: 4 }), null)
  })
  it('ogUrl wins, with a trailing slash', () => {
    assert.equal(deckUrl({ ...local, ogUrl: 'https://talks.example.com/x' }), 'https://talks.example.com/x/')
    assert.equal(deckUrl({ ...local, ogUrl: 'https://talks.example.com/x/', slide: 3 }), 'https://talks.example.com/x/3')
  })
  it('a non-http ogUrl is ignored', () => {
    assert.equal(deckUrl({ ...local, ogUrl: 'javascript:alert(1)' }), null)
    assert.equal(deckUrl({ ...pub, ogUrl: 'ftp://x' }), 'https://user.github.io/talk/')
  })
  it('a public host is used with the base', () => {
    assert.equal(deckUrl(pub), 'https://user.github.io/talk/')
    assert.equal(deckUrl({ ...pub, slide: 7 }), 'https://user.github.io/talk/7')
  })
  it('router modes', () => {
    assert.equal(deckUrl({ ...pub, slide: 7, routerMode: 'hash' }), 'https://user.github.io/talk/#/7')
    assert.equal(deckUrl({ ...pub, slide: 7, routerMode: 'memory' }), 'https://user.github.io/talk/')
  })
})
