// PDF/PNG export: `slidev export` loads slides with ?print, the browser export
// page is /export. (useNav().isPrintMode is the same test, for components.)
export const isPrintMode = () =>
  new URLSearchParams(location.search).has('print') || /\/export\b/.test(location.pathname)
