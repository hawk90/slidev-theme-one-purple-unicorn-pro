import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { normalizeHotkey, slideHotkeys } from '../utils/hotkeys.ts'

describe('normalizeHotkey', () => {
  it('keys and modifiers, as Slidev names them', () => {
    assert.equal(normalizeHotkey('q'), 'q')
    assert.equal(normalizeHotkey('Q'), 'q')
    assert.equal(normalizeHotkey(1), '1')
    assert.equal(normalizeHotkey('Shift + A'), 'shift+a')
    assert.equal(normalizeHotkey('shift+ctrl+a'), 'ctrl+shift+a')
    assert.equal(normalizeHotkey('F5'), 'f5')
    assert.equal(normalizeHotkey('home'), 'home')
  })
  it('null for what is not a key', () => {
    for (const v of ['', 'qq', 'hyper+a', 'shift+', true, undefined, 'foo'])
      assert.equal(normalizeHotkey(v), null, String(v))
  })
})

describe('slideHotkeys', () => {
  it('maps keys to slides, warns about junk, Slidev keys and repeats', () => {
    const { keys, warnings } = slideHotkeys([
      { no: 1, frontmatter: {} },
      { no: 2, frontmatter: { hotkey: 'a' } },
      { no: 3, frontmatter: { hotkey: 'q' } },
      { no: 4, frontmatter: { hotkey: 'Q' } },
      { no: 5, frontmatter: { hotkey: 'g' } },
      { no: 6, frontmatter: { hotkey: 'nope' } },
      { no: 7, frontmatter: { hotkey: 'shift+q' } },
    ])
    assert.deepEqual(keys, [{ key: 'a', no: 2 }, { key: 'q', no: 3 }, { key: 'shift+q', no: 7 }])
    assert.equal(warnings.length, 3)
    assert.match(warnings[0], /slide 4: "q" already goes to slide 3/)
    assert.match(warnings[1], /slide 5: "g" is one of Slidev's own keys/)
    assert.match(warnings[2], /slide 6: "nope" is not a key/)
  })
})
