// Shiki has no CUDA grammar, and a fence in an unknown language fails the
// whole slide. GitHub (Linguist) and Pygments know `cuda` / `cu`, so code
// pasted from their docs uses them. Here they are C++ under another name; the
// CUDA transformer colors the CUDA names as in a `cpp` block.
//
// Slidev passes no `langAlias` to its highlighter, and Shiki doesn't load an
// embedded grammar on its own, so each name loads the C++ grammars plus a
// `cuda` grammar that includes them.
import { bundledLanguages } from 'shiki'

const cuda = {
  name: 'cuda',
  scopeName: 'source.cuda',
  aliases: ['cu', 'cuh'],
  embeddedLangs: ['cpp'],
  patterns: [{ include: 'source.cpp' }],
}

const withCpp = async () => [...(await bundledLanguages.cpp()).default, cuda]

/** For setup/shiki.ts `langs` (Slidev's record form) */
export const cudaLangs = { cuda: withCpp, cu: withCpp, cuh: withCpp }
