// One set of color names for every component prop that takes a color
// (Stat, StoryBox, PatternCard sections, Timeline items): the One Dark
// accents, which a themeConfig palette and light mode retune, plus primary
// and gray. Badge's `variant` has the same names. Anything else is used as a
// CSS color as given ("#ff6b6b", "rebeccapurple", "var(--x)").
// (No magenta: with themeConfig.primary it is the primary color, #57.)

export const COLOR_NAMES = ['primary', 'blue', 'cyan', 'green', 'yellow', 'red', 'gray'] as const
export type ColorName = typeof COLOR_NAMES[number]

const VARS: Record<ColorName, string> = {
  primary: 'var(--primary-400)',
  blue: 'var(--one-dark-blue)',
  cyan: 'var(--one-dark-cyan)',
  green: 'var(--one-dark-green)',
  yellow: 'var(--one-dark-yellow)',
  red: 'var(--one-dark-red)',
  gray: 'var(--text-muted)',
}

/** The CSS color for a color prop; undefined when it is empty */
export function colorValue(color?: string | null): string | undefined {
  const c = color?.trim()
  if (!c) return undefined
  return VARS[c.toLowerCase() as ColorName] ?? c
}
