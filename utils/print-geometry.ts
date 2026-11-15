// Pure geometry for the export redraws (print-effects.ts, print-gradient-text.ts),
// kept apart so it is unit-tested (test/print-geometry.test.ts).

import { splitList } from './print-canvas.ts'

export interface Shadow { color: string, x: number, y: number, blur: number, spread: number }

/** Computed box-shadow / text-shadow ("rgb(…) 0px 10px 25px 0px, …"); inset
 *  shadows are left out (the browser draws those fine) */
export function parseShadows(value: string, withSpread: boolean): Shadow[] {
  if (!value || value === 'none') return []
  return splitList(value).flatMap((item) => {
    if (/\binset\b/.test(item)) return []
    const m = item.match(/^(.*?)\s+(-?[\d.]+)px\s+(-?[\d.]+)px(?:\s+(-?[\d.]+)px)?(?:\s+(-?[\d.]+)px)?$/)
    if (!m) return []
    return [{ color: m[1], x: Number(m[2]), y: Number(m[3]), blur: Number(m[4] ?? 0), spread: withSpread ? Number(m[5] ?? 0) : 0 }]
  })
}

/** How far a shadow reaches past its shape: a CSS blur radius B is a Gaussian
 *  with σ = B/2, which fades out by 3σ */
export const shadowReach = (sh: Shadow) => 1.5 * sh.blur + Math.max(0, sh.spread) + 1

/** The area [x0, y0, x1, y1] a set of shadows of a w×h shape at (x, y) can reach */
export function shadowBounds(shadows: Shadow[], x: number, y: number, w: number, h: number) {
  return [
    Math.min(...shadows.map(sh => x + sh.x - shadowReach(sh))),
    Math.min(...shadows.map(sh => y + sh.y - shadowReach(sh))),
    Math.max(...shadows.map(sh => x + w + sh.x + shadowReach(sh))),
    Math.max(...shadows.map(sh => y + h + sh.y + shadowReach(sh))),
  ] as const
}

/**
 * A CSS linear-gradient's line over a w×h box at (x, 0): it passes through
 * the box center at `angle` degrees (0 = up), and its length makes the
 * corners land on 0% and 100%. Returns the start and end points and length.
 */
export function gradientLine(angle: number, x: number, w: number, h: number) {
  const rad = angle * Math.PI / 180
  const dx = Math.sin(rad)
  const dy = -Math.cos(rad)
  const len = Math.abs(w * dx) + Math.abs(h * dy)
  const cx = x + w / 2
  const cy = h / 2
  return { x0: cx - dx * len / 2, y0: cy - dy * len / 2, x1: cx + dx * len / 2, y1: cy + dy * len / 2, len }
}
