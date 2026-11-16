import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { formatAuthors, formatEntry, parseBibtex } from '../utils/bibtex.ts'
import { apply, collect } from '../utils/references.ts'

const BIB = `
% a comment
@article{williams2009,
  author = {Williams, Samuel and Waterman, Andrew and Patterson, David},
  title = {Roofline: An Insightful Visual Performance Model},
  journal = {Communications of the ACM},
  volume = 52, number = 4,
  year = {2009},
  doi = {10.1145/1498765.1498785}
}
@inproceedings{knuth1974,
  author = "Donald E. Knuth",
  title = "Structured Programming with {go to} Statements",
  booktitle = {Computing Surveys},
  year = 1974,
}
@misc{nvidia, title={CUDA C++ Programming Guide}, howpublished={NVIDIA}, url={https://docs.nvidia.com/cuda/}}
`

describe('parseBibtex / format', () => {
  const entries = parseBibtex(BIB)
  it('reads the entries and their fields', () => {
    assert.deepEqual(entries.map(e => e.key), ['williams2009', 'knuth1974', 'nvidia'])
    assert.equal(entries[1].fields.title, 'Structured Programming with go to Statements')
    assert.equal(entries[0].fields.volume, '52')
    assert.equal(entries[1].fields.year, '1974')
  })
  it('authors', () => {
    assert.equal(formatAuthors('Williams, Samuel and Waterman, Andrew and Patterson, David'), 'Samuel Williams, Andrew Waterman, and David Patterson')
    assert.equal(formatAuthors('A and B and C and D'), 'A et al.')
    assert.equal(formatAuthors('Knuth, Donald'), 'Donald Knuth')
  })
  it('one reference', () => {
    assert.equal(formatEntry(entries[0]), 'Samuel Williams, Andrew Waterman, and David Patterson, *Roofline: An Insightful Visual Performance Model*, Communications of the ACM 52(4), 2009 [↗](https://doi.org/10.1145/1498765.1498785).')
    assert.equal(formatEntry(entries[2]), '*CUDA C++ Programming Guide*, NVIDIA [↗](https://docs.nvidia.com/cuda/).')
  })
})

describe('collect / apply', () => {
  const bib = new Map(parseBibtex(BIB).map(e => [e.key, e]))
  const run = (text: string) => {
    const lines = text.split('\n')
    const warnings: string[] = []
    apply(lines, collect(lines, k => bib.has(k)), bib, w => warnings.push(w))
    return { out: lines.join('\n'), warnings }
  }
  it('citations numbered by first use; groups; references list', () => {
    const { out } = run('See [@knuth1974] and [@williams2009; @knuth1974].\n\n<References />')
    assert.match(out, /See <span class="cite-group">\[<a class="cite" href="#ref-knuth1974" title="Donald E. Knuth \(1974\): Structured Programming with go to Statements">1<\/a>\]<\/span>/)
    assert.match(out, /\[<a[^>]*>2<\/a>, <a[^>]*>1<\/a>\]/)
    assert.match(out, /<ol class="references" start="1">\n<li id="ref-knuth1974">/)
    assert.ok(!out.includes('ref-nvidia'))
  })
  it('<References all /> and a range', () => {
    assert.ok(run('[@knuth1974]\n<References all />').out.includes('ref-nvidia'))
    const r = run('[@knuth1974] [@williams2009] [@nvidia]\n<References from="2" to="2" />').out
    assert.ok(r.includes('start="2"') && r.includes('ref-williams2009') && !r.includes('<li id="ref-knuth1974"'))
  })
  it('equations, theorems, figures', () => {
    const { out } = run('$$\nP = \\min(\\pi, \\beta I) \\label{eq:roofline}\n$$\n**Theorem {#thm:amdahl}.** Speedup is bounded.\n\nBy [@eq:roofline] and [@thm:amdahl].')
    assert.match(out, /\\tag\{1\}/)
    assert.match(out, /\*\*Theorem 1\.\*\*/)
    assert.match(out, /By \(1\) and Theorem 1\./)
  })
  it('code is left alone; unknown keys warn', () => {
    const { out, warnings } = run('`[@knuth1974]`\n```md\n[@knuth1974]\n```\n[@nope]')
    assert.ok(out.startsWith('`[@knuth1974]`\n```md\n[@knuth1974]\n```'))
    assert.match(out, /\?nope/)
    assert.equal(warnings.length, 1)
  })
})
