// What a <QRCode /> holds: its `url`, or the deck's public address. Pure, so it
// is unit-tested (test/deck-url.test.ts); the component passes in the page's
// origin, base and Slidev's config.

/** Schemes a code must not hold: opening them runs or smuggles content */
const UNSAFE_SCHEME = /^\s*(javascript|data|vbscript|file):/i

export const isSafeTarget = (text: string) => !UNSAFE_SCHEME.test(text)

export const isHttp = (text: string) => /^https?:\/\//i.test(text)

/**
 * Whether a phone in the audience could open this host: not this machine
 * (localhost, loopback, 0.0.0.0), not a private or link-local range, not mDNS
 * (*.local). An intranet deck on such an address sets `url` itself.
 */
export function isPublicHost(hostname: string) {
  const h = hostname.toLowerCase().replace(/^\[|\]$/g, '')
  if (!h || h === 'localhost' || h.endsWith('.localhost') || h.endsWith('.local')) return false
  const v4 = h.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/)
  if (v4) {
    const [a, b] = [Number(v4[1]), Number(v4[2])]
    return !(a === 0 || a === 10 || a === 127
      || (a === 172 && b >= 16 && b <= 31)
      || (a === 192 && b === 168)
      || (a === 169 && b === 254))
  }
  if (h.includes(':')) {
    // ::1, ::, unique local fc00::/7, link-local fe80::/10
    return !(h === '::1' || h === '::' || /^f[cd]/.test(h) || /^fe[89ab]/.test(h))
  }
  return true
}

export interface DeckUrlInput {
  /** `seoMeta.ogUrl` from the headmatter */
  ogUrl?: unknown
  /** location.origin and import.meta.env.BASE_URL of the running deck */
  origin: string
  base: string
  /** Slidev's routerMode: history (default) | hash | memory */
  routerMode?: string
  /** A slide number to link to, or none for the deck itself */
  slide?: number
}

/**
 * The deck's address for the audience, or null when there is none to give:
 * `seoMeta.ogUrl` (http/https) if set, else where the deck is served, but only
 * from a public host (a dev server or `slidev export` runs on localhost).
 */
export function deckUrl({ ogUrl, origin, base, routerMode, slide }: DeckUrlInput): string | null {
  let root: string
  if (typeof ogUrl === 'string' && isHttp(ogUrl)) root = ogUrl.replace(/\/?$/, '/')
  else {
    let host = ''
    try { host = new URL(origin).hostname } catch {}
    if (!isPublicHost(host)) return null
    root = origin + base
  }
  if (slide === undefined || routerMode === 'memory') return root // memory: no per-slide URLs
  return routerMode === 'hash' ? `${root}#/${slide}` : `${root}${slide}`
}
