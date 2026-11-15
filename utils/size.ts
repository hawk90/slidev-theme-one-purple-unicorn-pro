// A component's `size` prop: a preset (sm | default | lg | xl, a class that
// sets the component's size variable) or any CSS length (set on the variable
// inline). Used by QRCode and Countdown.

export const SIZE_PRESETS = ['sm', 'default', 'lg', 'xl'] as const

export const isSizePreset = (size: string) => (SIZE_PRESETS as readonly string[]).includes(size)

/** Class and style for `size` on a component whose CSS reads `cssVar` */
export function sizeAttrs(prefix: string, size: string, cssVar: string) {
  const s = String(size ?? '').trim()
  if (!s || isSizePreset(s)) return { class: `${prefix}-${s || 'default'}`, style: undefined }
  return { class: undefined, style: { [cssVar]: s } }
}
