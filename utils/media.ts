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

// Video and several pictures in the media layouts (components/internal/MediaFill.vue)

const VIDEO = /\.(mp4|webm|mov|m4v|ogv)(\?.*)?$/i

/** A video file (by its extension), shown with Slidev's <SlidevVideo> */
export const isVideo = (src: string) => VIDEO.test(src.trim())

/** `image` as a list: one path, or up to three (more are dropped) */
export function mediaList(value: unknown): string[] {
  const list = Array.isArray(value) ? value : [value]
  return list.map(v => String(v ?? '').trim()).filter(Boolean).slice(0, 3)
}

/**
 * The media column's width from `imageWidth`: a percentage or CSS length as
 * is, a fraction (0.4) as a percentage, a ratio "2/5" as a percentage; the
 * default half otherwise.
 */
export function mediaWidth(value: unknown): string {
  if (value === undefined || value === null || value === '') return '50%'
  const s = String(value).trim()
  const ratio = /^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/.exec(s)
  if (ratio && Number(ratio[2]) > 0) return `${Math.round((Number(ratio[1]) / Number(ratio[2])) * 1000) / 10}%`
  const n = Number(s)
  if (!Number.isNaN(n) && n > 0 && n < 1) return `${Math.round(n * 1000) / 10}%`
  return /^\d+(\.\d+)?(%|px|rem|em|vw|fr)$/.test(s) ? s : '50%'
}
