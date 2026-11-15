// After a Slidev upgrade: check the Slidev internals the theme relies on
// still exist (utils/slidev-dom.ts, the list in DEV.md). Opens the example
// deck in play and print mode, and looks for the rest in Slidev's source.
//
//   npm run check:slidev
//
// Exits 1 with the names that are gone.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { startDevServer } from './lib/shots.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const example = path.join(root, 'example')
const client = path.join(example, 'node_modules/@slidev/client')
const results = []
const check = (name, ok) => { results.push({ name, ok: !!ok }); console.log(`${ok ? 'ok  ' : 'GONE'} ${name}`) }

// In Slidev's source: names only its components or styles produce
const source = dir => fs.readdirSync(dir, { recursive: true })
  .filter(f => /\.(vue|ts|css)$/.test(f)).map(f => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n')
const src = source(client)
for (const name of ['slidev-slide-loading', 'slidev-pwa-indicator', 'print-slide-container', 'slidev-code-tab', 'tab-active-text-color', '--slidev-code-radius', '--slidev-code-font-size', '--slidev-transition-duration'])
  check(`source: ${name}`, src.includes(name))

const server = await startDevServer({ cwd: example, port: 3690 })
const browser = await chromium.launch()
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
  await page.goto(`http://localhost:${server.port}/1`)
  await page.waitForFunction(() => window.__slidev__?.nav, null, { timeout: 90000 })
  // a fresh server compiles the first slide on demand
  await page.waitForSelector('[data-slidev-no="1"] .slidev-layout', { timeout: 90000 }).catch(() => {})
  await page.waitForTimeout(1500)
  const dom = await page.evaluate(() => {
    const content = document.getElementById('slide-content')
    const show = content?.querySelector(':scope > #slideshow')
    const pages = [...(show?.children ?? [])]
    return {
      content: !!content,
      slideshow: !!show,
      pages: pages.length > 1 && pages.every(p => p.classList.contains('slidev-page') && p.hasAttribute('data-slidev-no')),
      vShow: pages.some(p => p.style.display === 'none'),
      layout: !!show?.querySelector('[data-slidev-no="1"] .slidev-layout'),
      globalLayers: !!content?.querySelector(':scope > .slide-chrome'),
    }
  })
  check('#slide-content', dom.content)
  check('#slide-content > #slideshow', dom.slideshow)
  check('.slidev-page[data-slidev-no] per slide', dom.pages)
  check('v-show hides the other pages (display: none)', dom.vShow)
  check('.slidev-layout in each page', dom.layout)
  check('global layers are children of #slide-content', dom.globalLayers)

  // A slide transition: the entering page gets *-enter-* classes
  const n = await page.evaluate(() => window.__slidev__.nav.slides.find(r => r.meta?.slide?.title === 'Entrance Animations')?.no)
  await page.evaluate(n => window.__slidev__.nav.go(n - 1), n)
  await page.waitForTimeout(1500)
  const entered = await page.evaluate(async () => {
    const seen = new Set()
    const obs = new MutationObserver(ms => ms.forEach(m => [...m.target.classList].forEach(c => /-enter-/.test(c) && seen.add(c))))
    obs.observe(document.getElementById('slideshow'), { subtree: true, attributes: true, attributeFilter: ['class'] })
    window.__slidev__.nav.next()
    await new Promise(r => setTimeout(r, 1200))
    obs.disconnect()
    return [...seen]
  })
  check('*-enter-from / -enter-active on a slide transition', entered.some(c => /-enter-(from|active)$/.test(c)))

  // The export page (/export): one container per
  // slide, the global layers in each
  const print = await browser.newPage({ viewport: { width: 1280, height: 720 } })
  await print.goto(`http://localhost:${server.port}/export`)
  await print.waitForSelector('.print-slide-container .slidev-layout', { timeout: 90000 }).catch(() => {})
  await print.waitForTimeout(1000)
  const p = await print.evaluate(() => {
    const c = document.querySelector('.print-slide-container')
    return { container: !!c, slideInside: !!c?.querySelector(':scope > .slidev-page .slidev-layout'), chrome: !!c?.querySelector(':scope > .slide-chrome') }
  })
  check('/export: .print-slide-container', p.container)
  check('/export: .slidev-page .slidev-layout inside it', p.slideInside)
  check('/export: global layers inside it', p.chrome)
}
finally {
  await browser.close()
  server.stop()
}

const gone = results.filter(r => !r.ok)
console.log(gone.length ? `\n${gone.length} gone: update utils/slidev-dom.ts and the CSS listed in DEV.md` : '\nall present')
process.exit(gone.length ? 1 : 0)
