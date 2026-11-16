// Links in exports (PDF, PNG): a link whose text isn't its address prints as
// "text (url)", so a printed handout still says where it goes. On by default
// in print mode; `printUrls: false` in the headmatter turns it off, and a
// link in `.no-print-url` (or with that class) keeps its text alone. The
// slide chrome, snippet "view source" links, card-like (block) links, and
// links around images or inside code are left alone. Started by global-bottom.vue.

/** The address as a reader would type it: no scheme, `www.`, `mailto:`, trailing slash */
export function bareUrl(href: string): string {
  return href.trim().replace(/^mailto:/i, '').replace(/^[a-z][\w+.-]*:\/\//i, '').replace(/^www\./i, '').replace(/\/+$/, '')
}

/** The URL to print after a link, or '' when its text already says it (or it goes nowhere outside) */
export function printedUrl(text: string, href: string | null | undefined): string {
  if (!href || !/^(https?:|mailto:)/i.test(href)) return ''
  const shown = bareUrl(href)
  const said = text.trim().replace(/^↗\s*|\s*↗$/g, '')
  // the text says the address already ("web npmjs.com/…", "sli.dev")
  if (!said || bareUrl(said).toLowerCase().includes(shown.toLowerCase())) return ''
  return shown
}

const SKIP = '.slide-chrome, .snippet-source, .scaled-iframe-url, .no-print-url, pre, code, .slidev-code-wrapper, svg'

export function markPrintLinks(root: ParentNode) {
  for (const a of root.querySelectorAll<HTMLAnchorElement>('a[href]:not([data-print-url])')) {
    // links around pictures, and card-like ones (a block: the URL would land
    // at the card's end), are left alone
    if (a.closest(SKIP) || a.querySelector('img, video, svg, iframe') || !getComputedStyle(a).display.startsWith('inline')) continue
    const url = printedUrl(a.textContent ?? '', a.getAttribute('href'))
    a.dataset.printUrl = url
    // a real span after the link (a link's ::after is the theme's underline)
    if (url) {
      const note = document.createElement('span')
      note.className = 'print-url'
      note.textContent = ` (${url})`
      a.after(note)
    }
  }
}

/** Mark the links as the export renders its pages */
export function watchPrintLinks(): () => void {
  let frame = 0
  const update = () => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => markPrintLinks(document))
  }
  update()
  const observer = new MutationObserver(update)
  observer.observe(document.body, { childList: true, subtree: true })
  return () => { observer.disconnect(); cancelAnimationFrame(frame) }
}
