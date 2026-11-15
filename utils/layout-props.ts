// Props shared by layouts built on CenteredSlide (cover, section, quote, ...)
export function centeredLayoutProps(contentMaxWidth: string, padding = '4rem 6rem') {
  return {
    padding: { type: String, default: padding },
    contentMaxWidth: { type: String, default: contentMaxWidth },
  }
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
