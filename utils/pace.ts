// The pace marker on the progress bar (`paceBar: true`, global-bottom.vue):
// time used against the deck's `duration`, next to the slides done. Pure, so
// it is tested (test/pace.test.ts).

const UNITS: Record<string, number> = {
  s: 1, sec: 1, secs: 1,
  m: 60, min: 60, mins: 60,
  h: 3600, hr: 3600, hrs: 3600, hour: 3600, hours: 3600,
}

/**
 * Seconds in a Slidev `duration`: a number (seconds), "mm:ss", "h:mm:ss", or
 * units ("30min", "1h15m", "90s"). Slidev's default is 30min. Null when it
 * can't be read or isn't positive.
 */
export function durationSeconds(value: unknown): number | null {
  if (typeof value === 'number') return value > 0 ? value : null
  const text = String(value ?? '').trim().replace(/^\+/, '')
  if (!text) return null
  let seconds: number
  if (text.includes(':')) {
    const parts = text.split(':').map(Number)
    if (parts.length > 3 || parts.some(Number.isNaN)) return null
    seconds = parts.reduce((sum, n) => sum * 60 + n, 0)
  }
  else if (!/[a-z]/i.test(text)) {
    seconds = Number(text)
  }
  else {
    seconds = 0
    let matched = ''
    for (const m of text.matchAll(/([\d.]+)\s*([a-z]+)/gi)) {
      const unit = UNITS[m[2].toLowerCase()]
      if (unit === undefined) return null
      seconds += Number(m[1]) * unit
      matched += m[0]
    }
    if (matched.replace(/\s/g, '') !== text.replace(/\s/g, '')) return null
  }
  return Number.isFinite(seconds) && seconds > 0 ? seconds : null
}

export type PaceState = 'on' | 'behind' | 'late'

/**
 * Where the time marker goes (percent of the bar, capped at 100) and how the
 * talk is doing: `on` while the slides keep up with the time (within `slack`
 * percent), `behind` up to `late` percent behind, then `late`.
 */
export function pace(elapsedMs: number, durationS: number, slidePercent: number, slack = 5, late = 15): { percent: number, state: PaceState } {
  const percent = Math.min(100, Math.max(0, elapsedMs / 1000 / durationS * 100))
  const gap = percent - slidePercent
  return { percent, state: gap <= slack ? 'on' : gap <= late ? 'behind' : 'late' }
}

/** Milliseconds on Slidev's shared timer (presenter view), 0 when stopped */
export function timerElapsed(timer: { status?: string, startedAt?: number, pausedAt?: number } | undefined, now: number): number {
  if (!timer || timer.status === 'stopped' || !timer.startedAt) return 0
  if (timer.status === 'paused') return Math.max(0, (timer.pausedAt ?? 0) - timer.startedAt)
  return Math.max(0, now - timer.startedAt)
}
