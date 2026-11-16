// Slide hotkeys (`hotkey: q` on a slide jumps there; setup/shortcuts.ts).
// Pure, so it is tested (test/hotkeys.test.ts).

/** Keys Slidev itself uses in the presentation (setup/shortcuts.ts in
 *  @slidev/client, plus `f` for fullscreen). A hotkey on one of them would
 *  fire both */
export const RESERVED_KEYS = new Set([
  'space', 'enter', 'escape', 'arrowleft', 'arrowright', 'arrowup', 'arrowdown',
  'left', 'right', 'up', 'down', 'pageup', 'pagedown', 'd', 'o', 'g', 'f', '`',
  'shift+l', // the theme's layout guide (utils/authoring.ts)
  'shift+h', // high contrast (utils/a11y.ts)
])

const MODIFIERS = ['ctrl', 'alt', 'shift', 'meta']

/**
 * A hotkey as Slidev's key names read it (lower case, "shift+q"), or null
 * when it isn't one: a single character or a named key, with modifiers.
 */
export function normalizeHotkey(value: unknown): string | null {
  if (typeof value !== 'string' && typeof value !== 'number') return null
  const parts = String(value).trim().toLowerCase().split('+').map(s => s.trim())
  if (parts.some(p => !p)) return null
  const key = parts.pop()!
  if (!parts.every(p => MODIFIERS.includes(p))) return null
  if (!/^[\w`\-=[\];',./]$/.test(key) && !/^(f\d{1,2}|home|end|delete|backspace|tab|insert)$/.test(key)) return null
  return [...MODIFIERS.filter(m => parts.includes(m)), key].join('+')
}

export interface Hotkey { key: string, no: number }

export function slideHotkeys(slides: { no: number, frontmatter: Record<string, unknown> }[]): { keys: Hotkey[], warnings: string[] } {
  const keys: Hotkey[] = []
  const warnings: string[] = []
  const taken = new Map<string, number>()
  for (const s of slides) {
    const raw = s.frontmatter.hotkey
    if (raw === undefined || raw === null || raw === false) continue
    const key = normalizeHotkey(raw)
    if (!key) { warnings.push(`slide ${s.no}: "${raw}" is not a key`); continue }
    if (RESERVED_KEYS.has(key)) { warnings.push(`slide ${s.no}: "${key}" is one of Slidev's own keys`); continue }
    if (taken.has(key)) { warnings.push(`slide ${s.no}: "${key}" already goes to slide ${taken.get(key)}`); continue }
    taken.set(key, s.no)
    keys.push({ key, no: s.no })
  }
  return { keys, warnings }
}
