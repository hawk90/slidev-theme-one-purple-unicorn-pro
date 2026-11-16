import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { blobUrl, dedent, parseSnippet, pickLines, snippetLang } from '../utils/snippets.ts'

const FILE = ['#include <a>', '', '__global__ void k() {', '  int i = 0;', '}', 'int main() {', '  k<<<1, 1>>>();', '}']

describe('parseSnippet', () => {
  it('a range in brackets; plain <<< is left to Slidev', () => {
    assert.deepEqual(parseSnippet('<<< @/code/k.cu[9-15] {2|3}'), { path: '@/code/k.cu', range: '9-15', rest: '{2|3}' })
    assert.deepEqual(parseSnippet('<<< ./k.cu[/__global__/,/^}/] cuda {lines:true}'), { path: './k.cu', range: '/__global__/,/^}/', rest: 'cuda {lines:true}' })
    assert.equal(parseSnippet('<<< @/code/k.cu#region'), null)
    assert.equal(parseSnippet('<<< @/code/k.cu'), null)
  })
})

describe('pickLines', () => {
  it('numbers', () => {
    assert.deepEqual(pickLines(FILE, '3-5'), { from: 3, to: 5 })
    assert.deepEqual(pickLines(FILE, '6-'), { from: 6, to: 8 })
    assert.deepEqual(pickLines(FILE, '4'), { from: 4, to: 4 })
    assert.deepEqual(pickLines(FILE, '7-99'), { from: 7, to: 8 })
    assert.ok('error' in pickLines(FILE, '9'))
    assert.ok('error' in pickLines(FILE, '5-3'))
  })
  it('anchors: start to the first end after it', () => {
    assert.deepEqual(pickLines(FILE, '/__global__/,/^}/'), { from: 3, to: 5 })
    assert.deepEqual(pickLines(FILE, '/int main/,/^}/'), { from: 6, to: 8 })
    assert.deepEqual(pickLines(FILE, '/int main/'), { from: 6, to: 8 })
    assert.ok('error' in pickLines(FILE, '/nope/,/^}/'))
    assert.ok('error' in pickLines(FILE, 'k()'))
  })
})

describe('dedent', () => {
  it('the shared indent only', () => {
    assert.deepEqual(dedent(['    a', '      b', '', '    c']), ['a', '  b', '', 'c'])
  })
})

describe('blobUrl', () => {
  it('GitHub, GitLab, Bitbucket; ssh and https', () => {
    assert.equal(blobUrl('git@github.com:me/repo.git', 'main', 'code/k.cu', 3, 5), 'https://github.com/me/repo/blob/main/code/k.cu#L3-L5')
    assert.equal(blobUrl('https://github.com/me/repo', 'dev', 'a b.cu', 4, 4), 'https://github.com/me/repo/blob/dev/a%20b.cu#L4')
    assert.equal(blobUrl('https://gitlab.com/g/r.git', 'main', 'x.py', 1, 2), 'https://gitlab.com/g/r/-/blob/main/x.py#L1-L2')
    assert.equal(blobUrl('git@bitbucket.org:t/r.git', 'main', 'x.py', 1, 2), 'https://bitbucket.org/t/r/src/main/x.py#lines-1:2')
    assert.equal(blobUrl('/srv/git/repo.git', 'main', 'x', 1, 1), null)
  })
})

describe('snippetLang', () => {
  it('given, else from the extension', () => {
    assert.equal(snippetLang('k.cu', '{2}'), 'cuda')
    assert.equal(snippetLang('k.cu', 'cpp {2}'), 'cpp')
    assert.equal(snippetLang('a.py', ''), 'python')
    assert.equal(snippetLang('a.go', ''), 'go')
  })
})
