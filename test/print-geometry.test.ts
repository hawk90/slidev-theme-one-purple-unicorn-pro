import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { gradientLine, parseShadows, shadowBounds, shadowReach } from '../utils/print-geometry.ts'
import { beamKeyframes, lapDuration, lapMs } from '../utils/beam-path.ts'
import { gridTemplate } from '../utils/layout-props.ts'

describe('parseShadows', () => {
  it('box-shadow list with spread', () => assert.deepEqual(
    parseShadows('rgba(0, 0, 0, 0.4) 0px 10px 15px -3px, rgb(1, 2, 3) 1px 2px 3px 4px', true),
    [{ color: 'rgba(0, 0, 0, 0.4)', x: 0, y: 10, blur: 15, spread: -3 }, { color: 'rgb(1, 2, 3)', x: 1, y: 2, blur: 3, spread: 4 }],
  ))
  it('text-shadow: no spread, blur optional', () => assert.deepEqual(
    parseShadows('red 1px 2px', false), [{ color: 'red', x: 1, y: 2, blur: 0, spread: 0 }],
  ))
  it('inset and none are left out', () => {
    assert.deepEqual(parseShadows('red 0px 0px 4px 0px inset', true), [])
    assert.deepEqual(parseShadows('none', true), [])
  })
})

describe('shadow extent', () => {
  const sh = { color: 'red', x: 2, y: 4, blur: 10, spread: 1 }
  it('reach: 1.5 × blur + spread + 1', () => assert.equal(shadowReach(sh), 17))
  it('bounds of a 100×50 shape at 0,0', () => assert.deepEqual([...shadowBounds([sh], 0, 0, 100, 50)], [-15, -13, 119, 71]))
})

describe('gradientLine', () => {
  const round = (o: Record<string, number>) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, Math.round(v * 1000) / 1000 + 0]))
  it('90deg: left to right, the box width long', () => assert.deepEqual(round(gradientLine(90, 0, 200, 100)), { x0: 0, y0: 50, x1: 200, y1: 50, len: 200 }))
  it('180deg: top to bottom', () => assert.deepEqual(round(gradientLine(180, 0, 200, 100)), { x0: 100, y0: 0, x1: 100, y1: 100, len: 100 }))
  it('45deg on a square: corner to corner', () => {
    const l = gradientLine(45, 0, 100, 100)
    assert.ok(Math.abs(l.len - 141.421) < 0.01)
  })
  it('offset by x', () => assert.equal(gradientLine(90, 10, 200, 100).x0, 10))
})

describe('beam path', () => {
  it('corners clockwise, offsets by distance', () => {
    const f = beamKeyframes(200, 100)
    assert.deepEqual(f.map(k => [k['--ab-x'], k['--ab-y'], Math.round(k.offset * 1000) / 1000]), [
      ['0px', '0px', 0], ['200px', '0px', 0.333], ['200px', '100px', 0.5], ['0px', '100px', 0.833], ['0px', '0px', 1],
    ])
  })
  it('lap duration: s, ms, fallback 6 s', () => {
    assert.equal(lapMs('3s'), 3000)
    assert.equal(lapMs(' 800ms '), 800)
    assert.equal(lapMs(''), 6000)
    assert.equal(lapMs('-2s'), 6000)
  })
  it('same speed on any box: a 600px border takes one lap time', () => {
    assert.equal(lapDuration('6s', 200, 100), 6000)
    assert.equal(lapDuration('6s', 400, 200), 12000)
  })
})

describe('gridTemplate', () => {
  it('shares, lengths, defaults', () => assert.equal(gridTemplate([2, '300px'], 3, false), '2fr 300px 1fr'))
  it('divider tracks', () => assert.equal(gridTemplate([], 2, true), '1fr 1px 1fr'))
  it('decimal share', () => assert.equal(gridTemplate(['1.5', '.5'], 2, false), '1.5fr .5fr'))
})
