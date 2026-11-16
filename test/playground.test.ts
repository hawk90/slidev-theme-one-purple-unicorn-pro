import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { playgroundLangs, playgroundUrl } from '../utils/playground.ts'

describe('playgroundLangs', () => {
  it('true: all; a list or a string: those known', () => {
    assert.ok(playgroundLangs(true)?.has('cuda'))
    assert.deepEqual([...playgroundLangs(['cuda', 'Python', 'cobol'])!], ['cuda', 'python'])
    assert.deepEqual([...playgroundLangs('cpp, rust')!], ['cpp', 'rust'])
    assert.equal(playgroundLangs(false), null)
    assert.equal(playgroundLangs('false'), null)
    assert.equal(playgroundLangs(undefined), null)
    assert.equal(playgroundLangs(['cobol']), null)
  })
})

describe('playgroundUrl', () => {
  it('Compiler Explorer client state with the language and the code', () => {
    const url = playgroundUrl('cuda', '__global__ void k() {}\n// é')!
    assert.ok(url.startsWith('https://godbolt.org/clientstate/'))
    const json = Buffer.from(decodeURIComponent(url.split('/').pop()!), 'base64').toString('utf8')
    assert.deepEqual(JSON.parse(json), { sessions: [{ id: 1, language: 'cuda', source: '__global__ void k() {}\n// é', compilers: [], executors: [] }] })
    assert.equal(JSON.parse(Buffer.from(decodeURIComponent(playgroundUrl('cpp', 'x')!.split('/').pop()!), 'base64').toString()).sessions[0].language, 'c++')
    assert.equal(playgroundUrl('text', 'x'), null)
  })
})
