// Image walkthrough geometry (components/ImageTour.vue). Pure, so it is tested.

/**
 * The transform that zooms an image (origin at its top-left) onto a spot:
 * scaled so the spot (w × h, fractions) fills the frame, at most `maxScale`,
 * then moved so the spot is centered, without showing past the image's edges.
 */
export function tourZoom(spot: { x: number, y: number, w?: number, h?: number }, maxScale = 4): { transform: string } {
  const w = spot.w ?? 0.3
  const h = spot.h ?? 0.3
  const s = Math.min(maxScale, Math.max(1, 1 / Math.max(w, h)))
  const clamp = (v: number) => Math.min(0, Math.max(1 - s, v))
  const tx = clamp(0.5 - spot.x * s)
  const ty = clamp(0.5 - spot.y * s)
  const pct = (v: number) => `${Math.round(v * 10000) / 100}%`
  return { transform: `translate(${pct(tx)}, ${pct(ty)}) scale(${Math.round(s * 100) / 100})` }
}
