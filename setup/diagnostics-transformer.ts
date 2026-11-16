// IDE-style marks in code blocks, written as a comment at the end of a line
// (any language's line comment: //, #, --, ;), and a folded preamble:
//
//   int *p = nullptr; // [!code error: null pointer dereference]
//   float acc = 0;    // [!code warning: unused variable]
//   int n = 32;       // [!code info: warp size]
//   sum += x[i];      // [!code value: 1024.5]
//   #include <cstdio>
//   #include <cuda_runtime.h>
//   // [!code fold: includes]      ← the lines above it fold into one row
//
// error / warning / info: the line gets a squiggle (error) or a tint, and the
// message shows after the code, as in an editor's inline diagnostics; value:
// a muted `= 1024.5` after the code. The comment itself is removed. The lines
// stay in the block (folded ones only hidden), so line-highlight clicks
// ({2|3-4}) keep counting from the block's first line.

import type { ShikiTransformer } from 'shiki'
import type { Content, Element } from './hast'
import { textOf } from './hast.ts' // .ts: node --test loads this file directly

const MARK = /\s*(?:\/\/|#|--|;|\/\*)\s*\[!code (error|warning|info|value|fold)(?::\s*(.*?))?\]\s*(?:\*\/)?\s*$/

export interface LineMark { kind: 'error' | 'warning' | 'info' | 'value' | 'fold', text: string, at: number }

/** The mark at the end of a line, and where it starts in the line's text */
export function lineMark(text: string): LineMark | null {
  const m = MARK.exec(text)
  return m ? { kind: m[1] as LineMark['kind'], text: (m[2] ?? '').trim(), at: m.index } : null
}

/** Cut a line's text at `at`: drop the text nodes (and emptied spans) after it */
function truncate(node: Element, at: number): number {
  let pos = 0
  const keep: Content[] = []
  for (const child of node.children) {
    if (pos >= at) break
    if (child.type === 'text') {
      const end = pos + child.value.length
      keep.push(end <= at ? child : { ...child, value: child.value.slice(0, at - pos) })
      pos = end
    }
    else if (child.type === 'element') {
      const len = textOf(child).length
      if (pos + len <= at) keep.push(child)
      else { truncate(child, at - pos); if (textOf(child)) keep.push(child) }
      pos += len
    }
  }
  node.children = keep
  return pos
}

const span = (cls: string, text: string): Element => ({
  type: 'element', tagName: 'span', properties: { class: cls }, children: [{ type: 'text', value: text }],
})

export function diagnosticsTransformer(): ShikiTransformer {
  return {
    name: 'one-purple-unicorn:diagnostics',
    code(code) {
      const lines = code.children.filter((c): c is Element => c.type === 'element')
      lines.forEach((line, i) => {
        const mark = lineMark(textOf(line))
        if (!mark) return
        truncate(line, mark.at)
        if (mark.kind === 'fold') {
          // this line and those above it fold; the first shows the summary
          for (let k = 0; k <= i; k++) this.addClassToHast(lines[k], 'line-folded')
          // The line breaks after the hidden lines go too (the lines are
          // inline blocks, a "\n" between: a hidden one would leave a blank
          // row); the line elements stay, so highlight ranges still count
          for (let k = i === 0 ? 0 : 1; k <= i; k++) {
            const next = code.children[code.children.indexOf(lines[k]) + 1]
            if (next?.type === 'text' && next.value === '\n') code.children.splice(code.children.indexOf(next), 1)
          }
          if (i === 0) return // nothing above it: the marker just goes
          this.addClassToHast(lines[0], 'line-fold-summary')
          // line numbers ({lines:true}, Slidev's `step` counter) go on as if
          // the folded lines were there: the next line keeps its number
          lines[0].properties.style = `counter-increment: step ${i}` // + its ::before's 1
          const n = i // the folded lines, the marker not counted
          lines[0].properties['data-fold'] = `${mark.text ? `${mark.text} · ` : ''}${n} line${n === 1 ? '' : 's'}`
          return
        }
        if (mark.kind === 'value') {
          line.children.push(span('diag-value', `= ${mark.text}`))
          return
        }
        this.addClassToHast(line, ['line-diag', `line-${mark.kind}`])
        if (mark.text) line.children.push(span(`diag-msg diag-${mark.kind}`, mark.text))
      })
    },
  }
}
