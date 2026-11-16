// Missing local pictures, at build time (setup/preparser.ts): Vite imports a
// slide's `![](/shot.png)` and `<img src="/shot.png">`, so a file that isn't
// there yet breaks the whole slide ("Failed to resolve import"). Those become
// a placeholder naming the path instead, with a warning in the terminal.
// Pictures given at runtime (a layout's `image:`) are caught in the browser
// (utils/authoring.ts). Code blocks are left alone. Pure: `exists` decides.

const MD_IMG = /!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g
const HTML_IMG = /<img\b[^>]*?\bsrc\s*=\s*(["'])([^"']+)\1[^>]*>/gi

/** Whether the path is a local file Vite would import (not a URL, data or a bound `:src`) */
export const isLocalAsset = (src: string) => !/^([a-z][\w+.-]*:|\/\/|#|data:|\{)/i.test(src) && /\.(png|jpe?g|gif|webp|avif|svg|bmp|ico)(\?.*)?$/i.test(src)

const note = (src: string) => `<span class="asset-missing-note">missing: ${src.replace(/</g, '&lt;')}</span>`

/** Replace references to missing pictures in `lines`; returns the paths replaced */
export function replaceMissingAssets(lines: string[], exists: (src: string) => boolean): string[] {
  const missing: string[] = []
  let fence = ''
  for (let i = 0; i < lines.length; i++) {
    const open = /^\s*(`{3,}|~{3,})/.exec(lines[i])?.[1]
    if (open && (!fence || open.startsWith(fence))) { fence = fence ? '' : open; continue }
    if (fence) continue
    const check = (whole: string, src: string) => {
      if (!isLocalAsset(src) || exists(src.replace(/\?.*$/, ''))) return whole
      missing.push(src)
      return note(src)
    }
    lines[i] = lines[i]
      .replace(MD_IMG, (whole, _alt, src) => check(whole, src))
      .replace(HTML_IMG, (whole, _q, src) => (/\s:src\s*=/.test(whole) ? whole : check(whole, src)))
  }
  return missing
}
