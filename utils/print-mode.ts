// Print mode: a PDF/PNG export (`slidev export` loads slides with ?print, the
// browser export page is the `export` route) or the browser printing the
// presentation. html.print-mode marks it; the CSS print rules (static
// animations, hidden timers…) hang off it. `slidev export` renders with
// screen media, so `@media print` alone would miss it.
//
// The router is asked, as useNav().isPrintMode does for components: in hash
// and memory router mode the route isn't in location.pathname, and a path
// like /export/… can be where the deck is hosted.

interface RouterLike {
  currentRoute: { value: { name?: unknown, query: Record<string, unknown> } }
  afterEach: (hook: () => void) => unknown
}

let router: RouterLike | undefined
const listeners: ((on: boolean) => void)[] = []

/** An export page (not the browser printing the presentation) */
export const isPrintMode = () => {
  const route = router?.currentRoute.value
  return new URLSearchParams(location.search).has('print')
    || route?.name === 'export'
    || 'print' in (route?.query ?? {})
}

/** An export of every click (`slidev export --with-clicks`: ?print=clicks):
 *  click-step styles (dim-prior, only-current…) then show per page */
export const isPrintWithClicks = () => {
  const route = router?.currentRoute.value
  return new URLSearchParams(location.search).get('print') === 'clicks'
    || route?.query?.print === 'clicks'
}

/** Called with the mode now and on every route change after */
export function onPrintModeChange(listener: (on: boolean) => void) {
  listeners.push(listener)
  listener(isPrintMode())
}

/** First thing in the app setup (setup/main.ts): the others ask isPrintMode() */
export function setupPrintMode(r?: RouterLike) {
  router = r
  const sync = () => {
    const on = isPrintMode()
    document.documentElement.classList.toggle('print-mode', on)
    document.documentElement.classList.toggle('print-clicks', on && isPrintWithClicks())
    listeners.forEach(l => l(on))
  }
  sync()
  router?.afterEach(() => setTimeout(sync))

  // Browser printing of the presentation itself: the CSS print rules only
  window.addEventListener('beforeprint', () => document.documentElement.classList.add('print-mode'))
  window.addEventListener('afterprint', sync)
}
