#!/usr/bin/env node
// Visual regression for the example deck: <base ref> vs the working tree.
//
//   npm run regress -- [--base main] [--mode dark|light|both] [--engine export|dev]
//                      [--range 1-20] [--threshold 200] [--out regress-out] [--fresh]
//
// Exits 1 when a slide changed; the report is regress-out/index.html.
//
// Both sides are copied to a temp dir (git archive for the ref, `git ls-files`
// for the working tree) so they run through the same code path; the user's
// tree is never touched. node_modules are symlinked from the main tree, and a
// generated vite.config.ts allows serving through those symlinks (otherwise
// KaTeX fonts are blocked and every math slide differs).
// Baseline shots are cached per commit SHA + mode + engine. Remote images in the
// deck are downloaded once and served locally, so both sides show the same
// pixels (a re-encoded or re-sized photo would otherwise differ run to run).

import { execFileSync, spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'

const repo = process.env.REGRESS_REPO || process.cwd()
const require = createRequire(path.join(repo, 'package.json'))
const { PNG } = require('pngjs')
const pixelmatch = require('pixelmatch').default ?? require('pixelmatch')

const args = process.argv.slice(2)
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i === -1 ? fallback : args[i + 1]
}
const flag = name => args.includes(`--${name}`)
const baseRef = opt('base', 'main')
const mode = opt('mode', 'both')
const engine = opt('engine', 'export')
const range = opt('range', '')
const threshold = Number(opt('threshold', '200'))
// slidev export (png, one-piece) waits only for <body> on /print, then counts
// .print-slide-container: on a cold compile that is 0 -> "exported", 0 files,
// or slide 1 still "Loading slide...". --wait runs before the count.
const exportWait = opt('wait', '3000')
const outDir = path.resolve(opt('out', path.join(repo, 'regress-out')))
const work = path.join(process.env.REGRESS_TMP || os.tmpdir(), 'slidev-regress')
const schemes = mode === 'both' ? ['light', 'dark'] : [mode]

const git = (...a) => execFileSync('git', a, { cwd: repo, encoding: 'utf8' }).trim()
const t0 = Date.now()
const log = (...m) => console.log(`[${((Date.now() - t0) / 1000).toFixed(1)}s]`, ...m)

// ---- 1. sources -----------------------------------------------------------
function prepare(label, fill, cacheName) {
  const dir = path.join(work, label)
  fs.rmSync(dir, { recursive: true, force: true })
  fs.mkdirSync(dir, { recursive: true })
  fill(dir)
  fs.symlinkSync(path.join(repo, 'node_modules'), path.join(dir, 'node_modules'))
  fs.symlinkSync(path.join(repo, 'example/node_modules'), path.join(dir, 'example/node_modules'))
  const cfg = path.join(dir, 'example/vite.config.mjs')
  if (fs.readdirSync(path.dirname(cfg)).some(f => /^vite\.config\./.test(f))) console.warn(`  ${label}: example/vite.config.* exists; not adding fs.allow`)
  // cacheDir: through the symlink the default node_modules/.vite is the MAIN
  // tree's cache, shared by base, head and the user's own dev server -> each
  // run re-optimizes, Vite reloads the page mid-export, export writes 0 files.
  // optimizeDeps.include: katex is otherwise discovered late (same reload).
  else fs.writeFileSync(cfg, `export default ${JSON.stringify({
    cacheDir: path.join(work, 'vite-cache', cacheName),
    optimizeDeps: { include: ['katex'] },
    server: { fs: { allow: [repo, dir] } },
  })}\n`)
  return path.join(dir, 'example')
}

// Remote images → files in the copy's public/ (cached across runs)
const REMOTE = /https:\/\/images\.unsplash\.com\/[^\s)"'`]+/g
async function pinRemoteImages(deckDir) {
  const deck = path.join(deckDir, 'slides.md')
  const md = fs.readFileSync(deck, 'utf8')
  const urls = [...new Set(md.match(REMOTE) ?? [])]
  if (!urls.length) return
  const cacheDir = path.join(work, 'remote-cache')
  const pub = path.join(deckDir, 'public', 'regress-remote')
  fs.mkdirSync(cacheDir, { recursive: true })
  fs.mkdirSync(pub, { recursive: true })
  let out = md
  for (const url of urls) {
    const name = createHash('sha1').update(url).digest('hex').slice(0, 12) + '.img'
    const cached = path.join(cacheDir, name)
    if (!fs.existsSync(cached)) {
      const r = await fetch(url)
      if (!r.ok) throw new Error(`could not download ${url}: ${r.status}`)
      fs.writeFileSync(cached, Buffer.from(await r.arrayBuffer()))
    }
    fs.copyFileSync(cached, path.join(pub, name))
    out = out.split(url).join(`/regress-remote/${name}`)
  }
  fs.writeFileSync(deck, out)
}
const fromRef = sha => dir => execFileSync('sh', ['-c', `git archive ${sha} | tar -x -C "${dir}"`], { cwd: repo })
const fromWorktree = dir => {
  const files = execFileSync('git', ['ls-files', '-z', '-co', '--exclude-standard'], { cwd: repo })
    .toString().split('\0').filter(f => f && fs.existsSync(path.join(repo, f)))
  for (const f of files) {
    fs.mkdirSync(path.join(dir, path.dirname(f)), { recursive: true })
    fs.copyFileSync(path.join(repo, f), path.join(dir, f))
  }
}

// ---- 2. capture -----------------------------------------------------------
const listPngs = d => fs.existsSync(d) ? fs.readdirSync(d).filter(f => /^\d+\.png$/.test(f)) : []

// Slides per side: an export that writes some but not all of them failed
const expected = new Map()

async function captureExport(deckDir, scheme, dest) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    // a fresh, non-existent dir every time: export into an existing dir can
    // come back empty, and a run can say "exported" yet write nothing
    const tmp = `${dest}.try${attempt}`
    fs.rmSync(tmp, { recursive: true, force: true })
    const a = ['slidev', 'export', 'slides.md', '--format', 'png', '--output', tmp, '--timeout', '60000', '--wait', exportWait]
    if (scheme === 'dark') a.push('--dark')
    if (range) a.push('--range', range)
    const r = await run('npx', a, deckDir, `${tmp}.log`)
    const n = listPngs(tmp).length
    const want = expected.get(deckDir)
    if (r === 0 && n > 0 && (want === undefined || n === want)) {
      expected.set(deckDir, n)
      fs.rmSync(dest, { recursive: true, force: true })
      fs.renameSync(tmp, dest)
      return n
    }
    log(`  export attempt ${attempt}: exit ${r}, ${n} files${want ? ` of ${want}` : ''}; retrying`)
  }
  throw new Error(`slidev export produced no slides in ${deckDir}`)
}

function run(cmd, a, cwd, logFile) {
  return new Promise((res) => {
    const p = spawn(cmd, a, { cwd, stdio: ['ignore', 'pipe', 'pipe'] })
    let out = ''
    p.stdout.on('data', d => { out += d }); p.stderr.on('data', d => { out += d })
    p.on('close', (code) => {
      if (logFile) fs.writeFileSync(logFile, out)
      if (/outside of Vite serving allow list/.test(out)) log('  WARN: Vite blocked files (fs.allow)')
      res(code)
    })
  })
}

let nextPort = 3650
async function captureDev(deckDir, scheme, dest) {
  const { chromium } = require('playwright')
  const port = nextPort++
  const proc = spawn('npx', ['slidev', 'slides.md', '--port', String(port)], { cwd: deckDir, stdio: 'ignore', detached: true })
  try {
    for (let i = 0; ; i++) {
      try { if ((await fetch(`http://localhost:${port}`)).ok) break } catch {}
      if (i > 120) throw new Error('dev server did not start')
      await new Promise(r => setTimeout(r, 500))
    }
    const browser = await chromium.launch()
    // same frame as `slidev export` png: 980x552 @2x
    const page = await browser.newPage({ viewport: { width: 980, height: 552 }, deviceScaleFactor: 2, colorScheme: scheme, reducedMotion: 'reduce' })
    await page.goto(`http://localhost:${port}/1`, { waitUntil: 'load' })
    await page.waitForFunction(() => window.__slidev__?.nav?.total, null, { timeout: 60000 })
    const total = await page.evaluate(() => window.__slidev__.nav.total)
    const [from, to] = range ? range.split('-').map(Number) : [1, total]
    fs.rmSync(dest, { recursive: true, force: true }); fs.mkdirSync(dest, { recursive: true })
    for (let n = from; n <= Math.min(to || from, total); n++) {
      await page.goto(`http://localhost:${port}/${n}?embedded=true`, { waitUntil: 'networkidle' })
      await page.evaluate(s => document.documentElement.classList.toggle('dark', s === 'dark'), scheme)
      await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' })
      await page.waitForFunction((no) => {
        const s = document.querySelector(`[data-slidev-no="${no}"]`)
        return s && !s.querySelector('.slidev-slide-loading') && [...document.images].every(i => i.complete)
      }, n, { timeout: 30000 }).catch(() => log(`  slide ${n}: still loading`))
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(300)
      await page.locator('#slide-content').screenshot({ path: path.join(dest, `${n}.png`) })
    }
    await browser.close()
    return total
  }
  finally { try { process.kill(-proc.pid) } catch {} }
}

const capture = engine === 'dev' ? captureDev : captureExport

// ---- 3. compare + report ---------------------------------------------------
function compare(a, b, scheme) {
  const rows = []
  const names = [...new Set([...listPngs(a), ...listPngs(b)])].sort((x, y) => parseInt(x) - parseInt(y))
  for (const f of names) {
    const n = parseInt(f)
    if (!fs.existsSync(path.join(a, f)) || !fs.existsSync(path.join(b, f))) { rows.push({ n, px: Infinity, note: fs.existsSync(path.join(a, f)) ? 'removed' : 'added' }); continue }
    const A = PNG.sync.read(fs.readFileSync(path.join(a, f))); const B = PNG.sync.read(fs.readFileSync(path.join(b, f)))
    if (A.width !== B.width || A.height !== B.height) { rows.push({ n, px: Infinity, note: 'size' }); continue }
    const D = new PNG({ width: A.width, height: A.height })
    const px = pixelmatch(A.data, B.data, D.data, A.width, A.height, { threshold: 0.05, diffMask: false, alpha: 0.2 })
    if (px > threshold) {
      const d = path.join(outDir, scheme); fs.mkdirSync(d, { recursive: true })
      fs.copyFileSync(path.join(a, f), path.join(d, `${n}-base.png`))
      fs.copyFileSync(path.join(b, f), path.join(d, `${n}-head.png`))
      fs.writeFileSync(path.join(d, `${n}-diff.png`), PNG.sync.write(D))
      rows.push({ n, px })
    }
  }
  return { total: names.length, changed: rows }
}

function html(results) {
  const sec = results.map(({ scheme, total, changed }) => `<h2>${scheme}: ${changed.length} of ${total} changed</h2>` + changed.map(r =>
    `<section><h3>Slide ${r.n} <small>${r.note || r.px + ' px'}</small></h3><div class="row">${['base', 'head', 'diff'].map(k =>
      `<figure><img loading="lazy" src="${scheme}/${r.n}-${k}.png" onerror="this.remove()"><figcaption>${k}</figcaption></figure>`).join('')}</div></section>`).join('')).join('')
  return `<!doctype html><meta charset="utf-8"><title>Visual regression</title><style>
body{font:14px system-ui;margin:16px;background:#fafafa;color:#222}.row{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
img{width:100%;border:1px solid #ccc}figure{margin:0}figcaption{text-align:center;color:#666}
@media (prefers-color-scheme:dark){body{background:#1b1b1f;color:#ddd}}</style>
<h1>${baseRef} (${baseSha.slice(0, 7)}) → working tree</h1>${sec}`
}

// ---- main ------------------------------------------------------------------
const baseSha = git('rev-parse', baseRef)
log(`base ${baseRef} = ${baseSha.slice(0, 7)}, engine ${engine}, modes ${schemes.join('+')}`)
let baseDeck = null
const headDeck = prepare('head', fromWorktree, 'head')
await pinRemoteImages(headDeck)
log('prepared working-tree copy')
fs.rmSync(outDir, { recursive: true, force: true }); fs.mkdirSync(outDir, { recursive: true })
const results = []
for (const scheme of schemes) {
  const cache = path.join(work, 'cache', `${baseSha}-${engine}-${scheme}${range ? '-' + range : ''}`)
  if (flag('fresh') || !listPngs(cache).length) {
    if (!baseDeck) {
      baseDeck = prepare(`base-${baseSha.slice(0, 7)}`, fromRef(baseSha), 'base')
      await pinRemoteImages(baseDeck)
    }
    log(`${scheme}: base ${await capture(baseDeck, scheme, cache)} slides`)
  }
  else log(`${scheme}: base from cache (${listPngs(cache).length} slides)`)
  const headShots = path.join(work, `head-${engine}-${scheme}`)
  log(`${scheme}: head ${await capture(headDeck, scheme, headShots)} slides`)
  const r = compare(cache, headShots, scheme)
  results.push({ scheme, ...r })
  log(`${scheme}: ${r.total} slides, ${r.changed.length} changed${r.changed.length ? ': ' + r.changed.map(c => `${c.n}${c.note ? ` (${c.note})` : ` (${c.px}px)`}`).join(', ') : ''}`)
}
fs.writeFileSync(path.join(outDir, 'index.html'), html(results))
log(`report: ${path.join(outDir, 'index.html')}`)
process.exit(results.some(r => r.changed.length) ? 1 : 0)
