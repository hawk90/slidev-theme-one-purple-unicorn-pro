import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { isLocalAsset, replaceMissingAssets } from '../utils/missing-assets.ts'

const have = new Set(['/logo.png', './pics/a.jpg'])
const run = (text: string) => {
  const lines = text.split('\n')
  const missing = replaceMissingAssets(lines, s => have.has(s))
  return { out: lines.join('\n'), missing }
}

describe('replaceMissingAssets', () => {
  it('markdown and html pictures that are missing', () => {
    const r = run('![shot](/shot.png) and ![logo](/logo.png)\n<img src="./pics/b.jpg" alt="b"> <img src="./pics/a.jpg">')
    assert.deepEqual(r.missing, ['/shot.png', './pics/b.jpg'])
    assert.equal(r.out, '<span class="asset-missing-note">missing: /shot.png</span> and ![logo](/logo.png)\n<span class="asset-missing-note">missing: ./pics/b.jpg</span> <img src="./pics/a.jpg">')
  })
  it('leaves URLs, bound sources and code alone', () => {
    const r = run('![x](https://a.dev/x.png)\n<img :src="pic" src="/x.png">\n```md\n![y](/y.png)\n```')
    assert.deepEqual(r.missing, [])
  })
})

describe('isLocalAsset', () => {
  it('pictures by path only', () => {
    assert.equal(isLocalAsset('/a.png'), true)
    assert.equal(isLocalAsset('img/a.svg?raw'), true)
    assert.equal(isLocalAsset('data:image/png;base64,xx'), false)
    assert.equal(isLocalAsset('//cdn.dev/a.png'), false)
    assert.equal(isLocalAsset('/demo.mp4'), false)
  })
})
