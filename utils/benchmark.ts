// <Benchmark> rows: bar lengths, the winner, and each result against the
// baseline (the first). Pure, so it is tested (test/benchmark.test.ts).

export interface BenchmarkRow { label: string, share: number, winner: boolean, text: string, ratio: string }

const fmt = (n: number) => (Math.abs(n) >= 100 ? n.toFixed(0) : Math.abs(n) >= 10 ? n.toFixed(1) : n.toFixed(2)).replace(/\.0+$|(\.\d*?)0+$/, '$1')

export function benchmarkRows(results: { label: string, value: number }[], lowerIsBetter = true, unit = ''): BenchmarkRow[] {
  const values = results.map(r => Number(r.value))
  const valid = values.filter(v => Number.isFinite(v) && v > 0)
  if (!valid.length) return results.map(r => ({ label: r.label, share: 0, winner: false, text: '', ratio: '' }))
  const max = Math.max(...valid)
  const best = lowerIsBetter ? Math.min(...valid) : max
  const base = values[0]
  return results.map((r, i) => {
    const v = values[i]
    const ok = Number.isFinite(v) && v > 0
    // how many times better than the baseline: base / v for times, v / base for rates
    const times = ok && base > 0 ? (lowerIsBetter ? base / v : v / base) : NaN
    return {
      label: r.label,
      share: ok ? v / max : 0,
      winner: ok && v === best && valid.length > 1,
      text: ok ? `${fmt(v)}${unit ? ` ${unit}` : ''}` : '—',
      ratio: i === 0 || !Number.isFinite(times) ? (i === 0 ? 'base' : '') : `${fmt(times)}×`,
    }
  })
}
