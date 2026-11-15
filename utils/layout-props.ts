// Props shared by layouts built on CenteredSlide (cover, section, quote, ...)
export function centeredLayoutProps(contentMaxWidth: string, padding = '4rem 6rem') {
  return {
    padding: { type: String, default: padding },
    contentMaxWidth: { type: String, default: contentMaxWidth },
  }
}

/** grid-template-columns for the column layouts: a bare number is a share
 *  of the row (2 → 2fr), anything else a CSS length, empty 1fr; a 1px
 *  track between columns with a divider */
export function gridTemplate(widths: unknown[], count: number, divider: boolean) {
  const w = Array.from({ length: count }, (_, i) => {
    const v = String(widths[i] ?? '').trim()
    return !v ? '1fr' : /^\d*\.?\d+$/.test(v) ? `${v}fr` : v
  })
  return w.join(divider ? ' 1px ' : ' ')
}

type Column = 'left' | 'center' | 'right'
const width = () => ({ type: [String, Number], default: '1fr' })
const text = () => ({ type: String, default: '' })

// Props shared by the column layouts (two-cols, three-cols): per column a
// width (a bare number is a share), a label and its color; one divider flag
export function columnLayoutProps<C extends Column>(columns: readonly C[]) {
  const props: Record<string, unknown> = { divider: { type: Boolean, default: false } }
  for (const c of columns) {
    props[`${c}Width`] = width()
    props[`${c}Label`] = text()
    props[`${c}LabelColor`] = text()
  }
  return props as { divider: { type: BooleanConstructor, default: boolean } }
    & { [K in `${C}Width`]: ReturnType<typeof width> }
    & { [K in `${C}Label` | `${C}LabelColor`]: ReturnType<typeof text> }
}
