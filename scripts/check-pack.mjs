#!/usr/bin/env node
// Check the theme as npm ships it: pack it, install the tarball into a fresh
// deck, build that deck under a sub-path (`slidev build --base /sub/`), serve
// it there and open every slide. Fails on a request that 404s, a page error,
// or an image or background that doesn't load from /sub/ (the bug e63ac91
// fixed: a root path like /bg.png bypassing the base).
//
//   npm run check:pack            (keeps nothing; --keep leaves the temp dir)
//
// The deck project borrows example/node_modules (Slidev and its deps) through
// symlinks, so nothing is downloaded; the theme itself is the extracted
// tarball, so a file missing from package.json "files" fails here.

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import http from 'node:http'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { PNG } from 'pngjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const keep = process.argv.includes('--keep')
const BASE = '/sub/'
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'theme-pack-'))
const deck = path.join(tmp, 'deck')
const log = (...m) => console.log('[check:pack]', ...m)
const fail = []
const SLIDES = 6 // the deck below; a production build has no window.__slidev__

try {
  // 1. pack + extract into the deck's node_modules
  const [{ filename, files }] = JSON.parse(execFileSync('npm', ['pack', '--json', '--pack-destination', tmp], { cwd: root, encoding: 'utf8' }))
  log(`packed ${filename}: ${files.length} files`)
  const nm = path.join(deck, 'node_modules')
  fs.mkdirSync(nm, { recursive: true })
  const pkgDir = path.join(nm, 'slidev-theme-one-purple-unicorn-pro')
  fs.mkdirSync(pkgDir)
  execFileSync('tar', ['-xzf', path.join(tmp, filename), '-C', pkgDir, '--strip-components', '1'])
  const borrowed = path.join(root, 'example/node_modules')
  for (const entry of fs.readdirSync(borrowed)) {
    if (entry === 'slidev-theme-one-purple-unicorn-pro') continue
    fs.symlinkSync(path.join(borrowed, entry), path.join(nm, entry))
  }

  // 2. a deck that exercises root-path assets on every kind of slide
  fs.mkdirSync(path.join(deck, 'public'))
  const png = new PNG({ width: 64, height: 36 })
  for (let i = 0; i < png.data.length; i += 4) png.data.set([120, 80, 200, 255], i)
  fs.writeFileSync(path.join(deck, 'public/bg.png'), PNG.sync.write(png))
  fs.writeFileSync(path.join(deck, 'public/my bg (1).png'), PNG.sync.write(png))
  fs.writeFileSync(path.join(deck, 'package.json'), JSON.stringify({ name: 'pack-check', private: true, type: 'module' }))
  fs.writeFileSync(path.join(deck, 'slides.md'), `---
theme: one-purple-unicorn-pro
title: Pack check
logo: /bg.png
footer: [logo, title]
layout: cover
background: /bg.png
---

# Cover with a background

---
layout: image
image: /bg.png
---

# Image layout

---
layout: full-image
image: /my bg (1).png
---

# Full image, a path with spaces

---
layout: section
background: /bg.png
bg: mesh
---

# Section

---
parallax: /bg.png
---

# Parallax

---
layout: end
---

# End
`)

  // 3. build under the sub-path
  log(`slidev build --base ${BASE}`)
  execFileSync(path.join(nm, '.bin/slidev'), ['build', '--base', BASE, '--out', 'dist'], { cwd: deck, stdio: ['ignore', 'pipe', 'inherit'] })

  // 4. serve dist at /sub/ (an SPA: unknown paths get index.html)
  const dist = path.join(deck, 'dist')
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.json': 'application/json' }
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(new URL(req.url, 'http://x').pathname)
    if (!url.startsWith(BASE)) { res.writeHead(404); return res.end() }
    let file = path.join(dist, url.slice(BASE.length))
    if (!file.startsWith(dist)) { res.writeHead(403); return res.end() }
    const isAsset = path.extname(url) !== ''
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      if (isAsset) { res.writeHead(404); return res.end() }
      file = path.join(dist, 'index.html')
    }
    res.writeHead(200, { 'content-type': types[path.extname(file)] ?? 'application/octet-stream' })
    fs.createReadStream(file).pipe(res)
  })
  await new Promise(r => server.listen(0, r))
  const port = server.address().port

  // 5. open each slide
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
  page.on('response', (r) => { if (r.status() >= 400) fail.push(`${r.status()} ${new URL(r.url()).pathname}`) })
  // (headless Chromium refuses Slidev's screen wake lock: not ours)
  page.on('pageerror', (e) => { if (!/Wake Lock/.test(String(e))) fail.push(`page error: ${String(e).split('\n')[0]}`) })
  const total = SLIDES
  for (let n = 1; n <= total; n++) {
    await page.goto(`http://localhost:${port}${BASE}${n}`, { waitUntil: 'networkidle' })
    await page.waitForSelector(`[data-slidev-no="${n}"] .slidev-layout`, { timeout: 30000 })
      .catch(() => fail.push(`slide ${n}: did not render`))
    await page.waitForTimeout(300)
    const urls = await page.evaluate(() => [...document.querySelectorAll('#slide-content *')]
      .flatMap(e => [...getComputedStyle(e).backgroundImage.matchAll(/url\("?([^")]+)"?\)/g)].map(m => m[1]))
      .concat([...document.querySelectorAll('#slide-content img')].map(i => i.currentSrc || i.src))
      .filter(u => !u.startsWith('data:')))
    for (const u of urls) {
      const p = new URL(u, 'http://x').pathname
      if (!p.startsWith(BASE)) fail.push(`slide ${n}: ${p} is outside ${BASE}`)
    }
    if (!urls.length && n < total) fail.push(`slide ${n}: no image or background found`)
  }
  await browser.close()
  server.close()
  log(`${total} slides checked`)
}
catch (e) {
  fail.push(String(e.message ?? e).split('\n').slice(0, 5).join('\n'))
}
finally {
  if (keep) log(`kept ${tmp}`)
  else fs.rmSync(tmp, { recursive: true, force: true })
}

if (fail.length) {
  console.log([...new Set(fail)].map(f => `  FAIL ${f}`).join('\n'))
  process.exit(1)
}
log('ok')
