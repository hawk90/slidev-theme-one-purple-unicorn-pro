// The anim-border light's path (border-beam.ts), pure so it is unit-tested.

import { durationMs } from './number.ts'

/** A box this long around takes one --ab-duration per lap */
export const REF_PERIMETER = 600

/** Keyframes along a w×h box's border, clockwise from the top-left corner:
 *  each corner's offset is the distance travelled, so the light moves at one
 *  speed along every edge with linear easing */
export function beamKeyframes(w: number, h: number) {
  const perimeter = 2 * (w + h)
  const corners: [number, number, number][] = [
    [0, 0, 0],
    [w, 0, w],
    [w, h, w + h],
    [0, h, 2 * w + h],
    [0, 0, perimeter],
  ]
  return corners.map(([x, y, d]) => ({ '--ab-x': `${x}px`, '--ab-y': `${y}px`, offset: d / perimeter }))
}

/** One lap's duration in ms from --ab-duration (`6s`, `800ms`); 6 s when
 *  unset or not a positive time */
export const lapMs = (raw: string) => durationMs(raw, 6000)

/** How long a lap takes on a w×h box: the same speed on any size */
export const lapDuration = (raw: string, w: number, h: number) => lapMs(raw) * 2 * (w + h) / REF_PERIMETER
