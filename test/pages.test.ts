import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { formatPageNumber, pageLabels, parsePageList } from '../utils/pages.ts'

const show = (fms: Record<string, unknown>[], format?: string) => {
  const { labels, total } = pageLabels(fms)
  return labels.map(l => formatPageNumber(l, total, format))
}

describe('parsePageList', () => {
  it('lists, ranges, arrays; clamps to the deck', () => {
    assert.deepEqual([...parsePageList('1, 3-4', 10)], [1, 3, 4])
    assert.deepEqual([...parsePageList([2, '8-12'], 9)], [2, 8, 9])
    assert.deepEqual([...parsePageList(undefined)], [])
  })
})

describe('pageLabels / formatPageNumber', () => {
  it('counts every slide by default', () => {
    assert.deepEqual(show([{}, {}, {}]), ['1 / 3', '2 / 3', '3 / 3'])
  })
  it('formats', () => {
    assert.deepEqual(show([{}, {}], 'c'), ['1', '2'])
    assert.deepEqual(show([{}, {}], 'c of t'), ['1 of 2', '2 of 2'])
    assert.deepEqual(show([{}, {}], 'nonsense'), ['1 / 2', '2 / 2'])
  })
  it('skip: no number, not counted', () => {
    assert.deepEqual(show([{}, { pageNumber: 'skip' }, {}]), ['1 / 2', '', '2 / 2'])
  })
  it('hold: shows the last number, not counted', () => {
    assert.deepEqual(show([{}, { pageNumber: 'hold' }, {}]), ['1 / 2', '1 / 2', '2 / 2'])
  })
  it('hold on the first slide shows 1', () => {
    assert.deepEqual(show([{ pageNumber: 'hold' }, {}]), ['1 / 1', '1 / 1'])
  })
  it('appendix: total freezes, pages become A1, A2', () => {
    assert.deepEqual(show([{}, {}, { appendix: true }, {}]), ['1 / 2', '2 / 2', 'A1', 'A2'])
    assert.deepEqual(show([{}, { appendix: 'true' }, { appendix: true }]), ['1 / 1', 'A1', 'A2'])
  })
  it('skip and hold inside the appendix', () => {
    assert.deepEqual(show([{}, { appendix: true }, { pageNumber: 'hold' }, { pageNumber: 'skip' }, {}]),
      ['1 / 1', 'A1', 'A1', '', 'A2'])
  })
})
