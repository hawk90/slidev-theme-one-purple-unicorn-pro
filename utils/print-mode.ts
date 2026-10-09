// PDF/PNG export: `slidev export` loads slides with ?print, the browser export
// page is the `export` route. In hash and memory router mode that route isn't in
// location.pathname (it is in the hash, or nowhere), so the router is asked, as
// useNav().isPrintMode does for components.

interface RouterLike { currentRoute: { value: { name?: unknown, query: Record<string, unknown> } } }

let router: RouterLike | undefined
export const trackPrintRoute = (r: RouterLike) => { router = r }

export const isPrintMode = () => {
  const route = router?.currentRoute.value
  return new URLSearchParams(location.search).has('print')
    || /\/export\b/.test(location.pathname)
    || route?.name === 'export'
    || 'print' in (route?.query ?? {})
}
