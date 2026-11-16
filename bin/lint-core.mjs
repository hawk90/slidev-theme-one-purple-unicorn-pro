// The deck lint's checks (bin/lint.mjs), against layouts.json. Pure: slides
// in ({ no, frontmatter, content }), problems out. Tested in test/lint.test.ts.
//
// - error: a `layout:` that is neither the theme's nor Slidev's
// - error: a theme component without a required prop
// - warning: a slide frontmatter key, or a component attribute, one or two
//   letters off a prop of that layout / component ("did you mean")
// - warning: <PascalCase> that is no component the theme, Slidev or the deck has

/** Slidev's own layouts (a theme's of the same name replaces them) */
export const SLIDEV_LAYOUTS = new Set([
  'center', 'cover', 'default', 'end', 'error', 'fact', 'full', 'iframe', 'iframe-left', 'iframe-right',
  'image', 'image-left', 'image-right', 'intro', 'none', 'quote', 'section', 'statement', 'two-cols', 'two-cols-header',
])

/** Slidev's built-in components */
export const SLIDEV_COMPONENTS = new Set([
  'Arrow', 'AutoFitText', 'Link', 'LightOrDark', 'PoweredBySlidev', 'RenderWhen', 'SlideCurrentNo', 'SlidesTotal',
  'Toc', 'Transform', 'Tweet', 'VAfter', 'VClick', 'VClicks', 'VDrag', 'VDragArrow', 'VSwitch', 'Youtube', 'SlidevVideo',
  'Template', 'Teleport', 'Transition', 'TransitionGroup', 'KeepAlive', 'Suspense', 'Component',
])

/** Tags the theme's preparser expands before Vue sees them (setup/preparser.ts) */
const THEME_SYNTAX = new Set(['References'])

/** Attributes every component takes (passed through, or Vue's own) */
const ANY_ATTR = /^(class|style|id|key|ref|is|slot|role|title|tabindex|aria-.*|data-.*|v-.*|#.*|@.*)$/

const camel = s => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase())

/** Edit distance, capped (only small ones matter) */
export function distance(a, b, cap = 3) {
  if (Math.abs(a.length - b.length) > cap) return cap + 1
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const cur = [i]
    for (let j = 1; j <= b.length; j++)
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    prev = cur
  }
  return prev[b.length]
}

/** The closest name within 2 edits (case-insensitive), or '' */
export function nearMiss(name, names) {
  let best = ''
  let bestD = 3
  for (const n of names) {
    if (n === name) return ''
    const d = distance(name.toLowerCase(), n.toLowerCase())
    if (d < bestD) { best = n; bestD = d }
  }
  return bestD <= 2 && best.length > 3 ? best : ''
}

/** <Name attr="…" :prop="…" flag> tags outside code blocks */
export function componentTags(content) {
  const text = content.replace(/^(`{3,}|~{3,})[^]*?^\1/gm, '').replace(/`[^`\n]*`/g, '')
  const tags = []
  for (const m of text.matchAll(/<([A-Z][A-Za-z0-9]*)((?:\s+[^\s=>/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*\/?>/g)) {
    const attrs = [...m[2].matchAll(/\s+([^\s=>/]+)(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/g)]
      .map(a => a[1].replace(/^(:|v-bind:)/, ''))
    tags.push({ name: m[1], attrs })
  }
  return tags
}

/**
 * The problems in a deck: [{ no, level: 'error' | 'warning', message }].
 * `own`: the deck's own component names (components/ next to it).
 */
export function lintSlides(slides, manifest, own = new Set()) {
  const out = []
  const layouts = manifest.layouts ?? {}
  const components = manifest.components ?? {}
  for (const { no, frontmatter: fm = {}, content = '' } of slides) {
    if (fm.layout !== undefined) {
      const name = String(fm.layout)
      if (!layouts[name] && !SLIDEV_LAYOUTS.has(name)) {
        const hint = nearMiss(name, [...Object.keys(layouts), ...SLIDEV_LAYOUTS])
        out.push({ no, level: 'error', message: `layout "${name}" doesn't exist${hint ? ` (did you mean "${hint}"?)` : ''}` })
      }
      const props = Object.keys(layouts[name]?.props ?? {})
      for (const key of Object.keys(fm)) {
        if (props.includes(key)) continue
        const hint = nearMiss(key, props)
        if (hint) out.push({ no, level: 'warning', message: `\`${key}:\` isn't a prop of layout ${name} (did you mean \`${hint}\`?)` })
      }
    }
    for (const tag of componentTags(content)) {
      const spec = components[tag.name]
      if (!spec) {
        if (SLIDEV_COMPONENTS.has(tag.name) || THEME_SYNTAX.has(tag.name) || own.has(tag.name)) continue
        const hint = nearMiss(tag.name, Object.keys(components))
        out.push({ no, level: 'warning', message: `<${tag.name}> is no component of the theme or Slidev${hint ? ` (did you mean <${hint}>?)` : ''}` })
        continue
      }
      const props = Object.keys(spec.props ?? {})
      const given = new Set(tag.attrs.map(camel))
      for (const [prop, p] of Object.entries(spec.props ?? {}))
        if (p.required && !given.has(prop)) out.push({ no, level: 'error', message: `<${tag.name}> needs \`${prop}\`` })
      for (const attr of tag.attrs) {
        const key = camel(attr)
        if (props.includes(key) || ANY_ATTR.test(attr)) continue
        const hint = nearMiss(key, props)
        if (hint) out.push({ no, level: 'warning', message: `<${tag.name} ${attr}>: no such prop (did you mean \`${hint}\`?)` })
      }
    }
  }
  return out
}
