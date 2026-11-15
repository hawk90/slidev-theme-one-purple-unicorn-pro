// A picture as a CSS background: FullBleed (full-image, full-split) and
// MediaPanel (image) both draw theirs this way. `url` is already resolved
// against the deck's base (resolveAssetUrl), so `--base` builds work.
export function backgroundImageStyle(url: string, size = 'cover', position = 'center'): Record<string, string> {
  if (!url) return {}
  return {
    // Quoted, so spaces and parentheses in the path don't break the CSS
    backgroundImage: `url(${JSON.stringify(url)})`,
    backgroundSize: size,
    backgroundPosition: position,
    backgroundRepeat: 'no-repeat',
  }
}
