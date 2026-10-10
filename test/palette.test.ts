import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { paletteCss } from '../utils/palette.ts'

const vars = (css: string) => Object.fromEntries([...css.matchAll(/(--[\w-]+): ([^;]+);/g)].map(m => [m[1], m[2]]))

const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const contrastOnWhite = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map(i => lin(Number.parseInt(hex.slice(i, i + 2), 16) / 255))
  return 1.05 / (0.2126 * r + 0.7152 * g + 0.0722 * b + 0.05)
}

describe('paletteCss', () => {
  it('nothing configured → no CSS', () => {
    assert.equal(paletteCss(undefined), '')
    assert.equal(paletteCss({}), '')
    assert.equal(paletteCss({ primary: '', accents: {} }), '')
  })

  it("the default purple reproduces colors.css's scale", () => {
    const v = vars(paletteCss({ primary: '#c678dd' }))
    assert.deepEqual(
      ['100', '300', '400', '500', '600', '700', '800', '900'].map(k => v[`--primary-${k}`]),
      ['#f2d9ff', '#d98eff', '#c678dd', '#b665cb', '#a652b8', '#8e449c', '#6b3377', '#482252'],
    )
    assert.equal(v['--glow-color'], '198, 120, 221')
  })

  it('3-digit hex, no #, upper case', () => {
    assert.equal(vars(paletteCss({ primary: 'F0A' }))['--primary-400'], '#ff00aa')
  })

  it('an invalid color warns and is ignored', (t) => {
    const warn = t.mock.method(console, 'warn', () => {})
    assert.equal(paletteCss({ primary: 'red', accents: { green: '#12345' } }), '')
    assert.equal(warn.mock.callCount(), 2)
    assert.match(String(warn.mock.calls[0].arguments[0]), /themeConfig\.primary.*"red"/)
    assert.match(String(warn.mock.calls[1].arguments[0]), /themeConfig\.accents\.green/)
  })

  it('secondary alone sets the partner, not the scale', () => {
    const v = vars(paletteCss({ secondary: '#a78bfa' }))
    assert.equal(v['--secondary-400'], '#a78bfa')
    assert.equal(v['--primary-400'], undefined)
  })

  it('accents: own shade, light shade, alert tint (cyan has none)', () => {
    const v = vars(paletteCss({ accents: { green: '#4ade80', cyan: '#22d3ee' } }))
    assert.equal(v['--one-dark-green'], '#4ade80')
    assert.match(v['--alert-success-bg'], /#4ade80 10%/)
    assert.ok(v['--light-cyan'])
    assert.equal(Object.keys(v).some(k => k.startsWith('--alert-info')), false)
  })

  it('every light-mode shade reaches 4.5:1 on white, for any hue and lightness', () => {
    const bad: string[] = []
    for (let h = 0; h < 360; h += 15) {
      for (const [s, l] of [[100, 50], [100, 80], [60, 65], [30, 90], [100, 30]]) {
        const hex = hsl(h, s, l)
        const v = vars(paletteCss({ primary: hex, secondary: hex, accents: { blue: hex, cyan: hex, green: hex, yellow: hex, red: hex } }))
        for (const [k, c] of Object.entries(v)) {
          if (/^--light-(primary|secondary|blue|cyan|green|yellow|red)$/.test(k) && contrastOnWhite(c) < 4.5)
            bad.push(`${hex} ${k} ${c} ${contrastOnWhite(c).toFixed(2)}`)
        }
      }
    }
    assert.deepEqual(bad, [])
  })

  it('all values are valid hex (gamut mapped)', () => {
    for (const p of ['#00ff00', '#0000ff', '#ff0000', '#ffffff', '#000000']) {
      for (const [k, c] of Object.entries(vars(paletteCss({ primary: p })))) {
        if (k.includes('gradient') || k === '--glow-color') continue
        assert.match(c, /^#[0-9a-f]{6}$/, `${p} ${k}`)
      }
    }
  })
})

function hsl(h: number, s: number, l: number) {
  s /= 100; l /= 100
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    return l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k - 3, 9 - k, 1))
  }
  return `#${[0, 8, 4].map(n => Math.round(f(n) * 255).toString(16).padStart(2, '0')).join('')}`
}
