#!/usr/bin/env node
// npm create one-purple-unicorn [folder] [-- --title "…" --author "…" --event "…" --no-install]
//
// A new Slidev deck with the One Purple Unicorn Pro theme: asks for the title,
// the presenter and the event (flags skip the questions), writes package.json,
// slides.md (the theme's starter.md, filled in), .gitignore and public/, and
// installs. Nothing is written into a folder that isn't empty.

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import readline from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import { fileURLToPath } from 'node:url'

const THEME = 'slidev-theme-one-purple-unicorn-pro'
const here = path.dirname(fileURLToPath(import.meta.url))

const args = process.argv.slice(2)
const flag = (name) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : undefined }
const VALUE_FLAGS = ['--title', '--author', '--event']
const positional = args.filter((a, i) => !a.startsWith('--') && !VALUE_FLAGS.includes(args[i - 1]))
const interactive = stdin.isTTY && !args.includes('--yes')

const rl = interactive ? readline.createInterface({ input: stdin, output: stdout }) : null
async function ask(question, fallback, given) {
  if (given !== undefined) return given
  if (!rl) return fallback
  const answer = (await rl.question(`${question} (${fallback}): `)).trim()
  return answer || fallback
}

const dirName = await ask('Folder', 'my-talk', positional[0])
const dir = path.resolve(dirName)
if (fs.existsSync(dir) && fs.readdirSync(dir).length) {
  rl?.close()
  console.error(`✗ ${dir} isn't empty: choose another folder`)
  process.exit(1)
}
const today = new Date().toISOString().slice(0, 10)
const title = await ask('Talk title', 'My Talk', flag('title'))
const author = await ask('Presenter', 'Your Name', flag('author'))
const event = await ask('Event', 'Meetup', flag('event'))
rl?.close()

// the starter: the theme's starter.md (copied in when packed; in the repo, read from there)
const yamlString = s => JSON.stringify(String(s)) // quoted: a title with ':' stays one value
const starterFile = [path.join(here, 'starter.md'), path.join(here, '../../starter.md')].find(f => fs.existsSync(f))
const starter = fs.readFileSync(starterFile, 'utf8')
  .replace(/^title: \{\{title\}\}$/m, `title: ${yamlString(title)}`)
  .replace(/^author: \{\{author\}\}$/m, `author: ${yamlString(author)}`)
  .replace(/^event: \{\{event\}\}$/m, `event: ${yamlString(event)}`)
  .replace(/^date: '\{\{date\}\}'$/m, `date: '${today}'`)
  .replace(/\{\{title\}\}/g, title.replace(/[<>]/g, ''))

const pkg = {
  name: path.basename(dir).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '') || 'slides',
  private: true,
  type: 'module',
  scripts: {
    dev: 'slidev --open',
    build: 'slidev build',
    export: 'slidev export',
    lint: 'one-purple-unicorn-lint slides.md',
  },
  dependencies: {
    '@slidev/cli': '^53.1.0',
    [THEME]: 'latest',
  },
}

fs.mkdirSync(path.join(dir, 'public'), { recursive: true })
fs.writeFileSync(path.join(dir, 'package.json'), `${JSON.stringify(pkg, null, 2)}\n`)
fs.writeFileSync(path.join(dir, 'slides.md'), starter)
fs.writeFileSync(path.join(dir, '.gitignore'), 'node_modules\ndist\n*.local\n.vite-inspect\n.remote-assets\n')
fs.writeFileSync(path.join(dir, 'public/.gitkeep'), '')
console.log(`✓ ${path.relative(process.cwd(), dir) || '.'}: package.json, slides.md, public/`)

if (!args.includes('--no-install')) {
  console.log('… npm install')
  execFileSync('npm', ['install'], { cwd: dir, stdio: 'inherit' })
}
console.log(`\nNext:\n  cd ${path.relative(process.cwd(), dir) || '.'}\n  npm run dev`)
