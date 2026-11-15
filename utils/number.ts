// Numbers written as text in slides ("$4.2M", "98.5%", "1,024", "+12%"):
// the number in them, and the same text again for another value, so a
// count-up keeps the prefix, suffix, decimals and grouping (<Stat count>).

export interface ParsedNumber {
  prefix: string
  value: number
  suffix: string
  decimals: number
  grouping: boolean
}

// The first number: digits with optional thousands commas and decimals, a
// minus sign right before it. Everything before it is the prefix ("$", "+",
// "~"), everything after it the suffix ("M", "%", " ms").
const NUMBER = /^(.*?)(-?)(\d{1,3}(?:,\d{3})+(?!\d)|\d+)(?:\.(\d+))?(.*)$/s

/** The number in `text`, or null when it has no digits */
export function parseNumber(text: string | number): ParsedNumber | null {
  if (typeof text === 'number') {
    if (!Number.isFinite(text)) return null
    text = String(text)
  }
  const m = NUMBER.exec(text)
  if (!m) return null
  const [, prefix, minus, whole, fraction = '', suffix] = m
  return {
    prefix,
    value: Number(`${minus}${whole.replaceAll(',', '')}.${fraction || '0'}`),
    suffix,
    decimals: fraction.length,
    grouping: whole.includes(','),
  }
}

/** A CSS time (`1.2s`, `800ms`) in ms; `fallback` when unset or not a
 *  positive time */
export function durationMs(raw: string, fallback: number) {
  const v = raw.trim()
  const ms = v.endsWith('ms') ? Number.parseFloat(v) : Number.parseFloat(v) * 1000
  return Number.isFinite(ms) && ms > 0 ? ms : fallback
}

/** `n` written the way `like` was written */
export function formatNumber(n: number, like: ParsedNumber): string {
  const fixed = Math.abs(n).toFixed(like.decimals)
  const [whole, fraction] = fixed.split('.')
  const grouped = like.grouping ? whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : whole
  // No "-0.0" on the way up from a negative start
  const sign = n < 0 && Number(fixed) !== 0 ? '-' : ''
  return `${like.prefix}${sign}${grouped}${fraction ? `.${fraction}` : ''}${like.suffix}`
}
