// CUDA Syntax Transformer for Shiki
// Adds CUDA-specific highlighting on top of C++ base colors. It runs on every
// language (CUDA-Python decks use numba's cuda.threadIdx…), but not inside
// comments and strings (a "cudaMalloc failed" message stays a string).

import type { ShikiTransformer } from 'shiki'
import type { Content, Element, Node } from './hast'
import { cudaTokens } from './cuda-tokens.ts' // .ts: node --test loads this file directly

const STYLES = new Map<string, string>()
for (const { words, color, bold, italic } of cudaTokens) {
  const style = `color:${color};${bold ? 'font-weight:bold;' : ''}${italic ? 'font-style:italic;' : ''}`
  for (const word of words.split(' ')) STYLES.set(word, style)
}

// Comments and strings are recognized by their color in the Shiki theme
// (spans carry colors, not scopes): `comment` and `string` in its tokenColors
interface ThemeLike { tokenColors?: { scope?: string | string[], settings?: { foreground?: string } }[] }
export function quietColors(theme: ThemeLike) {
  return (theme.tokenColors ?? [])
    .filter(t => [t.scope ?? []].flat().some(s => s === 'comment' || s === 'string'))
    .map(t => t.settings?.foreground)
    .filter((c): c is string => !!c)
}
// The theme's own (setup/themes/one-purple-unicorn.json), when not given
const THEME_QUIET = ['#5c6370', '#98c379']

type IsQuiet = (el: Element) => boolean
const quietTest = (colors: string[]): IsQuiet => {
  const re = new RegExp(`color:\\s*(${colors.map(c => c.replace(/[^#\w]/g, '')).join('|')})\\b`, 'i')
  return (el: Element) => re.test(String(el.properties?.style ?? ''))
}

function processSpan(span: Element, isQuiet: IsQuiet) {
  if (span.tagName !== 'span' || !span.children || isQuiet(span)) return

  const newChildren: Content[] = []

  for (const child of span.children) {
    if (child.type !== 'text') {
      newChildren.push(child)
      continue
    }

    const text = child.value
    let lastIndex = 0
    // \w+, so a name inside a longer word (mydim3, dim3x) is not one. Shiki
    // splits a number from what follows: in `3dim3`, `dim3` is marked
    for (const m of text.matchAll(/\w+/g)) {
      const style = STYLES.get(m[0])
      if (!style) continue
      if (m.index > lastIndex) newChildren.push({ type: 'text', value: text.slice(lastIndex, m.index) })
      newChildren.push({ type: 'element', tagName: 'span', properties: { style }, children: [{ type: 'text', value: m[0] }] })
      lastIndex = m.index + m[0].length
    }
    if (lastIndex === 0) newChildren.push(child)
    else if (lastIndex < text.length) newChildren.push({ type: 'text', value: text.slice(lastIndex) })
  }

  span.children = newChildren
}

const LAUNCH_STYLE = 'color:#ff6188;font-weight:bold;'
const KERNEL_STYLE = 'color:#a9dc76;font-weight:bold;'

// A kernel launch: name, optional template arguments (one level of nesting:
// foo<std::vector<int>>), <<<config>>>
const LAUNCH = /\b([A-Za-z_]\w*)\s*(?:<(?:[^<>;]|<[^<>;]*>)*>\s*)?(<<<)[^;]*?(>>>)/g

interface TextNode { parent: Element, index: number, start: number, value: string, quiet: boolean }

// The text nodes of a line, in order, with their parent, offset in the line,
// and whether they are in a comment or string
function textNodes(node: Node, isQuiet: IsQuiet, out: TextNode[] = [], pos = { at: 0 }, parent?: Element, quiet = false) {
  if (!('children' in node)) return out
  node.children.forEach((child, index) => {
    if (child.type === 'text' && parent) {
      out.push({ parent, index, start: pos.at, value: child.value, quiet })
      pos.at += child.value.length
    }
    else if (child.type === 'element') {
      textNodes(child, isQuiet, out, pos, child, quiet || isQuiet(child))
    }
  })
  return out
}

interface Range { start: number, end: number, style: string }

/** The kernel name and the <<< and >>> of each launch on a line of text,
 *  skipping launches that start in a comment or string (`quietAt`) */
export function launchRanges(text: string, quietAt: (i: number) => boolean = () => false): Range[] {
  const ranges: Range[] = []
  for (const m of text.matchAll(LAUNCH)) {
    const at = m.index!
    if (quietAt(at)) continue
    ranges.push({ start: at, end: at + m[1].length, style: KERNEL_STYLE })
    const open = at + m[0].indexOf('<<<', m[1].length)
    ranges.push({ start: open, end: open + 3, style: LAUNCH_STYLE })
    const close = at + m[0].length - 3
    ranges.push({ start: close, end: close + 3, style: LAUNCH_STYLE })
  }
  return ranges
}

// Split each text node at the range edges, wrapping the parts inside a range
// in a styled span; last node first, so the earlier nodes' indexes hold
function splitAtRanges(nodes: TextNode[], ranges: Range[], text: string) {
  for (const n of [...nodes].reverse()) {
    const end = n.start + n.value.length
    const cuts = ranges.filter(r => r.start < end && r.end > n.start)
    if (!cuts.length) continue
    const pieces: Content[] = []
    let at = n.start
    for (const r of cuts) {
      const a = Math.max(r.start, n.start)
      const b = Math.min(r.end, end)
      if (a > at) pieces.push({ type: 'text', value: text.slice(at, a) })
      pieces.push({ type: 'element', tagName: 'span', properties: { style: r.style }, children: [{ type: 'text', value: text.slice(a, b) }] })
      at = b
    }
    if (at < end) pieces.push({ type: 'text', value: text.slice(at, end) })
    n.parent.children.splice(n.index, 1, ...pieces)
  }
}

// Cross-span: style the kernel name and the <<< >>> of each launch. Shiki
// splits them unpredictably (`<<` + `<`, or `<float><<<` in one span), so
// ranges are found on the line's text and the text nodes split to fit.
function markKernelLaunch(codeNode: Element, isQuiet: IsQuiet) {
  for (const line of codeNode.children) {
    if (line.type !== 'element') continue
    const nodes = textNodes(line, isQuiet)
    const text = nodes.map(n => n.value).join('')
    if (!text.includes('<<<')) continue
    const quietAt = (i: number) => nodes.some(n => n.quiet && i >= n.start && i < n.start + n.value.length)
    const ranges = launchRanges(text, quietAt)
    if (ranges.length) splitAtRanges(nodes, ranges, text)
  }
}

/** `quiet`: the colors of comments and strings (quietColors(theme)), where
 *  names are left alone; by default this theme's */
export function cudaTransformer({ quiet = THEME_QUIET }: { quiet?: string[] } = {}): ShikiTransformer {
  const isQuiet = quietTest(quiet)
  return {
    name: 'cuda-highlighter',
    pre(node) {
      if (!this.source.includes('<<<')) return // no launch to mark
      const code = node.children.find((c): c is Element => c.type === 'element' && c.tagName === 'code')
      if (code) {
        markKernelLaunch(code, isQuiet)
      }
    },
    span(node) {
      processSpan(node, isQuiet)
    },
  }
}
