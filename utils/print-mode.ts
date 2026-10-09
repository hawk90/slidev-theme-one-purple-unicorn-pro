// PDF/PNG export: `slidev export` loads slides with ?print, the browser export
// page is the `export` route. The router is asked, as useNav().isPrintMode does
// for components: in hash and memory router mode the route isn't in
// location.pathname, and a path like /export/… can be where the deck is hosted.

interface RouterLike { currentRoute: { value: { name?: unknown, query: Record<string, unknown> } } }

let router: RouterLike | undefined
export const trackPrintRoute = (r: RouterLike) => { router = r }

export const isPrintMode = () => {
  const route = router?.currentRoute.value
  return new URLSearchParams(location.search).has('print')
    || route?.name === 'export'
    || 'print' in (route?.query ?? {})
}
