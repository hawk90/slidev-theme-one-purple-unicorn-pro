import { useNav } from '@slidev/client'
import { defineShortcutsSetup } from '@slidev/types'
import { slideHotkeys } from '../utils/hotkeys'
import { toggleLayoutGuide } from '../utils/authoring'

// `hotkey: q` on a slide: that key jumps to it (agenda, Q&A, appendix).
// Slidev's own keys are kept; a clash, a repeat or a non-key is reported in
// the console (utils/hotkeys.ts). Shortcuts are off while typing and in
// exports, as Slidev's are. A deck's own setup/shortcuts.ts runs after this
// one and gets these in `base`.
export default defineShortcutsSetup((nav, base) => {
  const { slides } = useNav()
  const { keys, warnings } = slideHotkeys(slides.value.map(s => ({ no: s.no, frontmatter: s.meta?.slide?.frontmatter ?? {} })))
  for (const w of warnings) console.warn(`[theme] hotkey: ${w}`)
  return [
    ...base,
    // shift+l: the layout guide (utils/authoring.ts)
    { name: 'theme-layout-guide', key: 'shift+l', fn: toggleLayoutGuide },
    ...keys.map(({ key, no }) => ({ name: `theme-hotkey-${key}`, key, fn: () => nav.go(no) })),
  ]
})
