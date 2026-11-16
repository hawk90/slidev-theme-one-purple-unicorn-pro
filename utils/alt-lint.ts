// Alt text lint (setup/preparser.ts): a terminal warning for each picture
// without alt text: `![](shot.png)`, `<img>` with no `alt` (an empty `alt=""`
// says it is decoration, and passes), and the image layouts (image,
// full-image, full-split) without `alt:`. `altLint: false` in the headmatter
// turns it off. Code blocks are left alone. Pure, so it is tested.

const IMAGE_LAYOUTS = new Set(['image', 'full-image', 'full-split'])

/** The pictures in a slide's Markdown with no alt text, by source */
export function picturesWithoutAlt(content: string): string[] {
  const out: string[] = []
  const text = content.replace(/^(`{3,}|~{3,})[^]*?^\1/gm, '')
  for (const m of text.matchAll(/!\[([^\]]*)\]\(\s*<?([^)\s>]+)/g))
    if (!m[1].trim()) out.push(m[2])
  for (const m of text.matchAll(/<img\b[^>]*>/gi)) {
    if (/\salt\s*=/.test(m[0]) || /\s:alt\s*=/.test(m[0])) continue
    out.push(/\s:?src\s*=\s*(["'])([^"']*)\1/.exec(m[0])?.[2] ?? '<img>')
  }
  return out
}

/** Whether a slide's layout shows a picture that needs `alt:` */
export const layoutNeedsAlt = (fm: Record<string, unknown>) =>
  IMAGE_LAYOUTS.has(String(fm.layout ?? '')) && !!fm.image && (fm.alt === undefined || fm.alt === null)
