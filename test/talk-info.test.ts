import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { coverInfo, footerParts, headmatterOf, isHeadmatterSlide, isOff, isOn, people } from '../utils/talk-info.ts'

describe('flags', () => {
  it('isOn / isOff take booleans and their strings only', () => {
    assert.deepEqual([true, 'true', false, 'false', undefined, '', 1].map(isOn), [true, true, false, false, false, false, false])
    assert.deepEqual([true, 'true', false, 'false', undefined, '', 0].map(isOff), [false, false, true, true, false, false, false])
  })
  it('isHeadmatterSlide: index 0 only', () => {
    assert.equal(isHeadmatterSlide({ index: 0 }), true)
    assert.equal(isHeadmatterSlide({ index: 1 }), false)
    assert.equal(isHeadmatterSlide(undefined), false)
  })
  it("headmatterOf drops Slidev's default title", () => {
    assert.equal(headmatterOf({ title: 'Slidev', event: 'X' }).title, undefined)
    assert.equal(headmatterOf({ title: 'Slidev', event: 'X' }).event, 'X')
    assert.equal(headmatterOf({ title: 'My talk' }).title, 'My talk')
  })
})

describe('people', () => {
  it('author: one name', () => assert.deepEqual(people({ author: 'Jane' }), [{ name: 'Jane' }]))
  it('authors win over author', () =>
    assert.deepEqual(people({ author: 'X', authors: ['A', { name: 'B', affiliation: 'Lab' }] }), [{ name: 'A' }, { name: 'B', affiliation: 'Lab' }]))
  it('drops empty, null and boolean entries', () =>
    assert.deepEqual(people({ authors: ['', null, true, { name: '' }, 'A'] }), [{ name: 'A' }]))
  it('numbers become text', () => assert.deepEqual(people({ author: 42 }), [{ name: '42' }]))
  it('nobody', () => assert.deepEqual(people({}), []))
})

describe('coverInfo', () => {
  const deck = { author: 'Jane', affiliation: 'Lab', event: 'GTC', date: new Date('2026-10-09'), logo: '/l.svg' }

  it('first slide shows the deck details; a YAML date as YYYY-MM-DD', () =>
    assert.deepEqual(coverInfo({}, deck, true), { people: [{ name: 'Jane' }], affiliation: 'Lab', parts: ['GTC', '2026-10-09'], logo: '/l.svg' }))
  it('coverInfo: false (or "false") hides them', () => {
    assert.equal(coverInfo({ coverInfo: false }, deck, true), null)
    assert.equal(coverInfo({ coverInfo: 'false' }, deck, true), null)
  })
  it('another cover: only with coverInfo: true', () => {
    assert.equal(coverInfo({}, deck, false), null)
    assert.ok(coverInfo({ coverInfo: true }, deck, false))
  })
  it("a cover's own values replace the deck's", () =>
    assert.deepEqual(coverInfo({ coverInfo: true, event: 'Meetup' }, deck, false)!.parts, ['Meetup', '2026-10-09']))
  it("own author replaces the deck's authors list", () =>
    assert.deepEqual(coverInfo({ author: 'Bob' }, { authors: ['A', 'B'] }, true)!.people, [{ name: 'Bob' }]))
  it("own people don't get the deck's affiliation", () =>
    assert.equal(coverInfo({ coverInfo: true, author: 'Bob' }, deck, false)!.affiliation, ''))
  it('…but keep their own affiliation', () =>
    assert.equal(coverInfo({ coverInfo: true, author: 'Bob', affiliation: 'Uni' }, deck, false)!.affiliation, 'Uni'))
  it('on the first slide, own author keeps the deck affiliation', () =>
    assert.equal(coverInfo({ author: 'Bob' }, deck, true)!.affiliation, 'Lab'))
  it('nothing to show → null', () => assert.equal(coverInfo({}, { title: 'T' }, true), null))
})

describe('footerParts', () => {
  const hm = { title: 'Talk', author: 'Jane', event: 'GTC', date: '2026-10-09', logo: '/l.svg' }
  it('true → title · author · event · date and the logo', () =>
    assert.deepEqual(footerParts(true, hm), { text: 'Talk · Jane · GTC · 2026-10-09', logo: '/l.svg' }))
  it('"true" works like true', () => assert.deepEqual(footerParts('true', hm), footerParts(true, hm)))
  it('a list: those, in its order; no logo unless listed', () =>
    assert.deepEqual(footerParts(['date', 'title'], hm), { text: '2026-10-09 · Talk', logo: '' }))
  it('authors joined', () =>
    assert.equal(footerParts(['authors'], { authors: ['A', { name: 'B' }] })!.text, 'A, B'))
  it('missing parts skipped', () => assert.equal(footerParts(true, { title: 'T' })!.text, 'T'))
  it('off', () => {
    for (const v of [false, 'false', undefined, null, 'yes']) assert.equal(footerParts(v, hm), null, String(v))
  })
})
