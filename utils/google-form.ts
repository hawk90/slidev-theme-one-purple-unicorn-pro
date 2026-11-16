// Google Forms addresses for <GoogleForm>. Pure, so it is tested.

/** The form's embeddable address: …/viewform?embedded=true (a forms.gle short
 *  link can't be embedded: it redirects, so it is returned as is) */
export function formEmbedUrl(url: string): string {
  try {
    const u = new URL(url)
    if (!/docs\.google\.com$/.test(u.hostname)) return url
    u.pathname = u.pathname.replace(/\/(edit|viewform|formResponse)?\/?$/, '/viewform')
    u.searchParams.set('embedded', 'true')
    return u.toString()
  }
  catch {
    return url
  }
}

/** A short form of the link to show under the QR code: the host and path,
 *  shortened in the middle when long */
export function formShortLink(url: string, max = 34): string {
  const s = url.replace(/^https?:\/\//, '').replace(/[?#].*$/, '').replace(/\/$/, '')
  return s.length <= max ? s : `${s.slice(0, max - 12)}…${s.slice(-10)}`
}
