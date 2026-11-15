import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

// Light mode re-declares part of the palette on <body> (light-theme.css);
// dark layouts get the root's values back through a --_root-* copy on :root
// and a restore block (colors.css). The three lists are kept by hand, so a
// variable added to one must be added to the others.

const css = (f: string) => readFileSync(new URL(`../styles/${f}`, import.meta.url), 'utf8')
const block = (src: string, opener: string) => {
  const start = src.indexOf(opener)
  assert.ok(start >= 0, `block ${opener} not found`)
  return src.slice(start, src.indexOf('}', start))
}
const decls = (body: string) => [...body.matchAll(/^\s*(--[\w-]+)\s*:\s*([^;]+);/gm)].map(m => [m[1], m[2].trim()] as const)

const light = decls(block(css('light-theme.css'), 'html:not(.dark) body {')).map(([k]) => k)
const colors = css('colors.css')
const copies = decls(block(colors, '--_root-bg-secondary'))
const restore = decls(block(colors, '--slide-bg: var(--dark-bg)'))

// Set in light mode but put back differently on dark layouts
const SPECIAL = new Set(['--slide-bg', '--_progress-track-default'])

describe('light-mode variables on dark layouts', () => {
  it('every light-mode variable has a --_root-* copy', () => {
    const copied = new Set(copies.map(([k]) => k.replace('--_root-', '--')))
    assert.deepEqual(light.filter(k => !SPECIAL.has(k) && !copied.has(k)), [])
  })
  it('every copy is the root value of its variable', () => {
    assert.deepEqual(copies.filter(([k, v]) => v !== `var(${k.replace('--_root-', '--')})`), [])
  })
  it('the restore block puts back exactly the light-mode variables, from their copies', () => {
    const restored = restore.filter(([k]) => !SPECIAL.has(k))
    assert.deepEqual(restored.filter(([k, v]) => v !== `var(--_root-${k.slice(2)})`), [])
    assert.deepEqual(restored.map(([k]) => k).sort(), light.filter(k => !SPECIAL.has(k)).sort())
  })
  it('the special ones are handled', () => {
    assert.deepEqual(restore.filter(([k]) => SPECIAL.has(k)), [['--slide-bg', 'var(--dark-bg)'], ['--_progress-track-default', 'initial']])
  })
})
