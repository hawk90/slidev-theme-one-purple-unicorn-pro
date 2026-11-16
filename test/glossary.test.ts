import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { glossaryEntries, glossaryPattern } from '../utils/glossary.ts'

const find = (text: string, terms: string[]) => [...text.matchAll(glossaryPattern(terms)!)].map(m => m[0])

describe('glossaryPattern', () => {
  it('whole words, longest first, any case', () => {
    assert.deepEqual(find('Shared memory is not global memory; memories differ.', ['memory', 'shared memory']), ['Shared memory', 'memory'])
    assert.deepEqual(find('warps and warp_size', ['warp']), [])
    assert.deepEqual(find('A warp, the warp.', ['WARP']), ['warp', 'warp'])
  })
  it('a Korean term before a particle; not inside another word', () => {
    assert.deepEqual(find('공유메모리 말고 메모리가 느려요. 메모리를 아껴요.', ['메모리']), ['메모리', '메모리'])
    assert.deepEqual(find('워프가 32개', ['워프']), ['워프'])
  })
  it('regex characters in terms', () => {
    assert.deepEqual(find('use C++ and C#', ['C++', 'C#']), ['C++', 'C#'])
  })
  it('none for no terms', () => assert.equal(glossaryPattern([]), null))
})

describe('glossaryEntries', () => {
  it('merged, the later wins, keyed by lower case', () => {
    const e = glossaryEntries({ Warp: '32 threads', SM: 'streaming multiprocessor' }, { warp: 'a group of 32 threads' }, null)
    assert.deepEqual([...e.keys()], ['warp', 'sm'])
    assert.equal(e.get('warp')!.text, 'a group of 32 threads')
  })
})
