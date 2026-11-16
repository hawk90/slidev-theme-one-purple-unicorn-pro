// A lightbox: a click on an image opens it full screen; on a link marked
// `.preview` (or data-preview), the linked page opens in a frame instead of a
// new tab. A click, Esc or the ✕ closes it; while it's open, the keys don't
// reach the slides. Which images: those with class `lightbox`, or every image
// on the slides with `lightbox: true` in the headmatter (not the logo or a
// QR code). Started by global-bottom.vue in the presentation (not in exports).

import { SLIDESHOW_ID } from './slidev-dom'

const SKIP = '.slide-footer-logo, .qr-code img, .person-avatar, .team-avatar, .speech-avatar, .no-lightbox'

export function watchLightbox(all: boolean): () => void {
  let overlay: HTMLElement | null = null

  const close = () => {
    overlay?.remove()
    overlay = null
    document.removeEventListener('keydown', onKey, true)
  }
  // capture: Esc closes, and no key moves the slides behind it
  const onKey = (e: KeyboardEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (e.key === 'Escape') close()
  }

  const open = (content: HTMLElement, label: string) => {
    close()
    overlay = document.createElement('div')
    overlay.className = 'lightbox-overlay'
    overlay.setAttribute('role', 'dialog')
    overlay.setAttribute('aria-modal', 'true')
    overlay.setAttribute('aria-label', label)
    const x = document.createElement('button')
    x.type = 'button'
    x.className = 'lightbox-close'
    x.setAttribute('aria-label', 'Close')
    x.textContent = '✕'
    overlay.append(content, x)
    overlay.addEventListener('click', (e) => { if (e.target !== content || content.tagName === 'IMG') close() })
    document.body.append(overlay)
    document.addEventListener('keydown', onKey, true)
    x.focus()
  }

  const onClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    const link = target.closest<HTMLAnchorElement>('a.preview, a[data-preview]')
    if (link?.href) {
      e.preventDefault()
      e.stopPropagation()
      const frame = document.createElement('iframe')
      frame.className = 'lightbox-frame'
      frame.src = link.dataset.preview || link.href
      frame.title = link.textContent?.trim() || link.href
      open(frame, frame.title)
      return
    }
    if (!(target instanceof HTMLImageElement) || target.closest(SKIP)) return
    if (!all && !target.classList.contains('lightbox')) return
    if (!target.closest(`#${SLIDESHOW_ID}`)) return
    e.stopPropagation()
    const img = document.createElement('img')
    img.className = 'lightbox-img'
    img.src = target.currentSrc || target.src
    img.alt = target.alt
    open(img, target.alt || 'Image')
  }

  document.addEventListener('click', onClick, true)
  // a hint for the images that open
  document.documentElement.classList.toggle('lightbox-all', all)
  return () => {
    close()
    document.removeEventListener('click', onClick, true)
    document.documentElement.classList.remove('lightbox-all')
  }
}
