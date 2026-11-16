// Contact links for <Person>, the speaker layout and the end slide's
// `questions` panel: a list where each entry is a URL, an e-mail address, a
// `{ label, url }`, or `{ github: name }` and the like. Pure, so it is tested
// (test/contact.test.ts).

export interface ContactLink { label: string, url: string, kind: string }

const SITES: Record<string, (name: string) => string> = {
  github: n => `https://github.com/${n}`,
  gitlab: n => `https://gitlab.com/${n}`,
  x: n => `https://x.com/${n}`,
  twitter: n => `https://x.com/${n}`,
  linkedin: n => `https://www.linkedin.com/in/${n}`,
  bluesky: n => `https://bsky.app/profile/${n}`,
  mastodon: (n) => {
    const m = /^@?([^@]+)@(.+)$/.exec(n)
    return m ? `https://${m[2]}/@${m[1]}` : n
  },
  web: n => (/^https?:\/\//.test(n) ? n : `https://${n}`),
}

const HOSTS: [RegExp, string][] = [
  [/(^|\.)github\.com$/, 'github'],
  [/(^|\.)gitlab\.com$/, 'gitlab'],
  [/(^|\.)(x|twitter)\.com$/, 'x'],
  [/(^|\.)linkedin\.com$/, 'linkedin'],
  [/(^|\.)bsky\.app$/, 'bluesky'],
]

const EMAIL = /^[^\s@/]+@[^\s@/]+\.[^\s@/]+$/

/** What a URL is (a site's name, or web) and a short label for it */
function fromUrl(url: string): ContactLink {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')
    const kind = HOSTS.find(([re]) => re.test(host))?.[1] ?? 'web'
    const path = u.pathname.replace(/\/+$/, '')
    return { kind, url, label: kind === 'web' ? host + path : (path.split('/').filter(Boolean).pop() ?? host).replace(/^@/, '@') }
  }
  catch {
    return { kind: 'web', url, label: url }
  }
}

export function contactLinks(value: unknown): ContactLink[] {
  const list = Array.isArray(value) ? value : value === undefined || value === null || value === '' ? [] : [value]
  const out: ContactLink[] = []
  for (const item of list) {
    if (typeof item === 'string') {
      const s = item.trim()
      if (!s) continue
      if (EMAIL.test(s.replace(/^mailto:/, ''))) {
        const mail = s.replace(/^mailto:/, '')
        out.push({ kind: 'email', url: `mailto:${mail}`, label: mail })
      }
      else {
        out.push(fromUrl(/^[a-z]+:\/\//i.test(s) ? s : `https://${s}`))
      }
    }
    else if (item && typeof item === 'object') {
      const o = item as Record<string, unknown>
      if (typeof o.url === 'string') {
        const base = fromUrl(o.url)
        out.push({ ...base, label: typeof o.label === 'string' ? o.label : base.label })
        continue
      }
      for (const [k, v] of Object.entries(o)) {
        const site = SITES[k.toLowerCase()]
        if (site && typeof v === 'string' && v) out.push({ kind: k === 'twitter' ? 'x' : k.toLowerCase(), url: site(v.replace(/^@(?=[^@]+$)/, '')), label: k === 'web' ? v.replace(/^https?:\/\//, '') : v })
        else if (k === 'email' && typeof v === 'string') out.push({ kind: 'email', url: `mailto:${v}`, label: v })
      }
    }
  }
  return out
}
