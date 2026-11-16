#!/usr/bin/env node
// Lint a deck against the theme's contract (layouts.json):
//
//   npx one-purple-unicorn-lint [slides.md] [--json]
//
// Unknown layouts and missing required props are errors (exit code 1);
// near-miss frontmatter keys, component attributes and component names are
// warnings. Run it in the deck's folder: it reads the deck with the deck's
// own @slidev/parser, and its components/ folder for the deck's own
// components.

import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { lintSlides } from './lint-core.mjs'

const args = process.argv.slice(2)
const file = path.resolve(args.find(a => !a.startsWith('--')) ?? 'slides.md')
const json = args.includes('--json')
if (!fs.existsSync(file)) {
  console.error(`[lint] no such deck: ${file}`)
  process.exit(2)
}

const here = path.dirname(fileURLToPath(import.meta.url))
const manifest = JSON.parse(fs.readFileSync(path.join(here, '..', 'layouts.json'), 'utf8'))

// the deck's own Slidev parser (a deck has @slidev/cli, and with it this)
const require = createRequire(file)
let parser
try { parser = await import(pathToFileURL(require.resolve('@slidev/parser/core')).href) }
catch {
  console.error('[lint] @slidev/parser not found: run this in the deck\'s folder, after npm install')
  process.exit(2)
}

const data = await parser.parse(fs.readFileSync(file, 'utf8'), file)
const slides = data.slides.map((s, i) => ({ no: i + 1, frontmatter: s.frontmatter ?? {}, content: s.content ?? '' }))
const compDir = path.join(path.dirname(file), 'components')
const own = new Set(fs.existsSync(compDir) ? fs.readdirSync(compDir).filter(f => f.endsWith('.vue')).map(f => f.replace(/\.vue$/, '')) : [])

const problems = lintSlides(slides, manifest, own)
if (json) console.log(JSON.stringify(problems, null, 2))
else {
  for (const p of problems) console.log(`${path.basename(file)} slide ${p.no}: ${p.level}: ${p.message}`)
  const errors = problems.filter(p => p.level === 'error').length
  console.log(`[lint] ${errors} errors, ${problems.length - errors} warnings in ${slides.length} slides`)
}
process.exit(problems.some(p => p.level === 'error') ? 1 : 0)
