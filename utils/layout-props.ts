// Props shared by layouts built on CenteredSlide (cover, section, quote, ...)
export function centeredLayoutProps(contentMaxWidth: string, padding = '4rem 6rem') {
  return {
    padding: { type: String, default: padding },
    contentMaxWidth: { type: String, default: contentMaxWidth },
  }
}
