// Scales and shapes for the dependency-free charts (components/Chart.vue,
// Radar.vue). Pure, so it is tested (test/chart.test.ts).

/** A "nice" upper bound and tick step for values up to `max` (1, 2, 2.5, 5 × 10ⁿ) */
export function niceScale(max: number, ticks = 4): { top: number, step: number } {
  if (!(max > 0)) return { top: 1, step: 0.25 }
  const mag = 10 ** Math.floor(Math.log10(max / ticks))
  // the smallest round step that needs at most ticks + 1 steps
  const step = [1, 2, 2.5, 5, 10, 20].map(m => m * mag).find(s => Math.ceil(max / s) <= ticks + 1)!
  return { top: Math.ceil(max / step) * step, step }
}

export interface Series { name: string, values: number[], color?: string }

/** `data` as series: a list of numbers is one series, else [{ name, values, color }] */
export function toSeries(data: unknown): Series[] {
  if (!Array.isArray(data) || !data.length) return []
  if (data.every(v => typeof v === 'number' || (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v)))))
    return [{ name: '', values: data.map(Number) }]
  return data.filter(s => s && typeof s === 'object').map((s: any) => ({ name: String(s.name ?? ''), values: (s.values ?? []).map(Number), color: s.color }))
}

/** Points of a radar polygon: one value per axis, 0..max on radius r, clockwise from the top */
export function radarPoints(values: number[], max: number, r: number): [number, number][] {
  const n = values.length
  return values.map((v, i) => {
    const a = (i / n) * 2 * Math.PI
    const k = Math.max(0, Math.min(1, v / max)) * r
    return [Math.round(k * Math.sin(a) * 100) / 100 || 0, Math.round(-k * Math.cos(a) * 100) / 100 || 0]
  })
}

/** A compact number for an axis: 1200 → 1.2k, 2500000 → 2.5M */
export function shortNumber(n: number): string {
  const abs = Math.abs(n)
  const f = (v: number, s: string) => `${Number.parseFloat(v.toFixed(1))}${s}`
  if (abs >= 1e9) return f(n / 1e9, 'G')
  if (abs >= 1e6) return f(n / 1e6, 'M')
  if (abs >= 1e3) return f(n / 1e3, 'k')
  return String(Number.parseFloat(n.toFixed(2)))
}

/** The theme's series colors, in order (CSS variables, so they follow light mode and themeConfig) */
export const SERIES_COLORS = ['var(--primary-400)', 'var(--one-dark-cyan)', 'var(--one-dark-yellow)', 'var(--one-dark-green)', 'var(--one-dark-red)', 'var(--secondary-400)']
