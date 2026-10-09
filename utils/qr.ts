// QR code encoder (byte mode), so <QRCode> works offline and without sending
// the URL to a QR service. A port of Project Nayuki's QR Code generator
// (MIT, https://www.nayuki.io/page/qr-code-generator-library), trimmed to what
// the component needs: UTF-8 byte mode, versions 1-40, automatic mask choice.

export type Ecc = 'L' | 'M' | 'Q' | 'H'

const ECC_ORDER: Ecc[] = ['L', 'M', 'Q', 'H']
const FORMAT_BITS: Record<Ecc, number> = { L: 1, M: 0, Q: 3, H: 2 }

// Indexed [ecc][version]; index 0 is unused
const ECC_CODEWORDS_PER_BLOCK: Record<Ecc, number[]> = {
  L: [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  M: [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
  Q: [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  H: [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
}
const NUM_ERROR_CORRECTION_BLOCKS: Record<Ecc, number[]> = {
  L: [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
  M: [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
  Q: [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
  H: [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81],
}

// Bits available for data and ECC in a symbol of this version
function numRawDataModules(ver: number) {
  let result = (16 * ver + 128) * ver + 64
  if (ver >= 2) {
    const numAlign = Math.floor(ver / 7) + 2
    result -= (25 * numAlign - 10) * numAlign - 55
    if (ver >= 7) result -= 36
  }
  return result
}

const numDataCodewords = (ver: number, ecc: Ecc) =>
  Math.floor(numRawDataModules(ver) / 8) - ECC_CODEWORDS_PER_BLOCK[ecc][ver] * NUM_ERROR_CORRECTION_BLOCKS[ecc][ver]

// Byte-mode segment length: 4-bit mode, character count, 8 bits per byte
const segmentBits = (ver: number, bytes: number) => 4 + (ver <= 9 ? 8 : 16) + bytes * 8

// GF(2^8) modulo x^8 + x^4 + x^3 + x^2 + 1 through log/antilog tables, for
// Reed-Solomon ECC (EXP is doubled so a sum of two logs needs no modulo)
const EXP = new Uint8Array(512)
const LOG = new Uint8Array(256)
for (let i = 0, x = 1; i < 255; i++) {
  EXP[i] = EXP[i + 255] = x
  LOG[x] = i
  x = (x << 1) ^ (x & 0x80 ? 0x11D : 0)
}
const gfMultiply = (x: number, y: number) => (x && y ? EXP[LOG[x] + LOG[y]] : 0)

// The generator polynomial of each degree, built once
const divisors = new Map<number, Uint8Array>()
function rsDivisor(degree: number) {
  let result = divisors.get(degree)
  if (result) return result
  result = new Uint8Array(degree)
  result[degree - 1] = 1
  for (let i = 0, root = 1; i < degree; i++, root = gfMultiply(root, 0x02)) {
    for (let j = 0; j < degree; j++) {
      result[j] = gfMultiply(result[j], root)
      if (j + 1 < degree) result[j] ^= result[j + 1]
    }
  }
  divisors.set(degree, result)
  return result
}

function rsRemainder(data: Uint8Array, divisor: Uint8Array) {
  const result = new Uint8Array(divisor.length)
  for (let k = 0; k < data.length; k++) {
    const factor = data[k] ^ result[0]
    result.copyWithin(0, 1)
    result[result.length - 1] = 0
    if (!factor) continue
    const lf = LOG[factor]
    for (let i = 0; i < divisor.length; i++) {
      if (divisor[i]) result[i] ^= EXP[LOG[divisor[i]] + lf]
    }
  }
  return result
}

export interface QrMatrix {
  size: number
  // size*size, row-major; 1 = dark module
  modules: Uint8Array
}

// Recent results: a deck renders the same few codes again and again
// (re-mounts, the presenter view, export)
const cache = new Map<string, QrMatrix>()
const CACHE_SIZE = 32

/**
 * Encode `text` (UTF-8) at the smallest version that fits. With `boost`, the
 * error correction is raised as far as it goes without a bigger symbol.
 */
export function encodeQr(text: string, ecc: Ecc = 'M', boost = true): QrMatrix {
  const key = `${ecc}${boost ? '+' : ''}\n${text}`
  const hit = cache.get(key)
  if (hit) return hit
  const result = encode(text, ecc, boost)
  if (cache.size >= CACHE_SIZE) cache.delete(cache.keys().next().value!)
  cache.set(key, result)
  return result
}

function encode(text: string, ecc: Ecc, boost: boolean): QrMatrix {
  const bytes = new TextEncoder().encode(text)

  let ver = 1
  for (; ; ver++) {
    if (ver > 40) throw new RangeError('QR code: text too long')
    if (segmentBits(ver, bytes.length) <= numDataCodewords(ver, ecc) * 8) break
  }
  const used = segmentBits(ver, bytes.length)
  if (boost) {
    for (const e of ECC_ORDER.slice(ECC_ORDER.indexOf(ecc) + 1)) {
      if (used <= numDataCodewords(ver, e) * 8) ecc = e
    }
  }

  // Data codewords: mode, count, bytes, terminator; pad bytes fill the rest
  const data = new Uint8Array(numDataCodewords(ver, ecc))
  let bit = 0
  const push = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--, bit++) data[bit >>> 3] |= ((val >>> i) & 1) << (7 - (bit & 7))
  }
  push(0b0100, 4)
  push(bytes.length, ver <= 9 ? 8 : 16)
  for (const b of bytes) push(b, 8)
  // The terminator and the byte padding are zero bits, already there
  for (let i = (bit + 4 + 7) >>> 3, pad = 0xEC; i < data.length; i++, pad ^= 0xEC ^ 0x11) data[i] = pad

  return drawSymbol(ver, ecc, interleave(data, ver, ecc))
}

// Split into blocks, add ECC to each, interleave the blocks' bytes
function interleave(data: Uint8Array, ver: number, ecc: Ecc) {
  const numBlocks = NUM_ERROR_CORRECTION_BLOCKS[ecc][ver]
  const blockEccLen = ECC_CODEWORDS_PER_BLOCK[ecc][ver]
  const rawCodewords = Math.floor(numRawDataModules(ver) / 8)
  const numShortBlocks = numBlocks - rawCodewords % numBlocks
  const shortBlockLen = Math.floor(rawCodewords / numBlocks)
  const divisor = rsDivisor(blockEccLen)

  const blocks: Uint8Array[] = []
  for (let i = 0, k = 0; i < numBlocks; i++) {
    const len = shortBlockLen - blockEccLen + (i < numShortBlocks ? 0 : 1)
    const dat = data.subarray(k, k + len)
    k += len
    // Short blocks get a placeholder byte so all blocks line up
    const block = new Uint8Array(shortBlockLen + 1)
    block.set(dat, 0)
    block.set(rsRemainder(dat, divisor), shortBlockLen + 1 - blockEccLen)
    blocks.push(block)
  }

  const result = new Uint8Array(rawCodewords)
  let n = 0
  for (let i = 0; i <= shortBlockLen; i++) {
    for (let j = 0; j < blocks.length; j++) {
      if (i !== shortBlockLen - blockEccLen || j >= numShortBlocks) result[n++] = blocks[j][i]
    }
  }
  return result
}

// The eight mask patterns, all periodic in 12 modules: a 12x12 tile each,
// 1 where a data module is inverted (looked up instead of computed per module)
const MASK_TILES = [
  (x: number, y: number) => (x + y) % 2 === 0,
  (_: number, y: number) => y % 2 === 0,
  (x: number) => x % 3 === 0,
  (x: number, y: number) => (x + y) % 3 === 0,
  (x: number, y: number) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
  (x: number, y: number) => x * y % 2 + x * y % 3 === 0,
  (x: number, y: number) => (x * y % 2 + x * y % 3) % 2 === 0,
  (x: number, y: number) => ((x + y) % 2 + x * y % 3) % 2 === 0,
].map((invert) => {
  const tile = new Uint8Array(144)
  for (let y = 0; y < 12; y++) {
    for (let x = 0; x < 12; x++) tile[y * 12 + x] = invert(x, y) ? 1 : 0
  }
  return tile
})

function drawSymbol(ver: number, ecc: Ecc, codewords: Uint8Array): QrMatrix {
  const size = ver * 4 + 17
  const modules = new Uint8Array(size * size)
  const isFunction = new Uint8Array(size * size)
  const setFunction = (x: number, y: number, dark: boolean) => {
    modules[y * size + x] = dark ? 1 : 0
    isFunction[y * size + x] = 1
  }

  // Timing patterns, then finders and alignment patterns over them
  for (let i = 0; i < size; i++) {
    setFunction(6, i, i % 2 === 0)
    setFunction(i, 6, i % 2 === 0)
  }
  for (const [cx, cy] of [[3, 3], [size - 4, 3], [3, size - 4]]) {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const dist = Math.max(Math.abs(dx), Math.abs(dy))
        const x = cx + dx
        const y = cy + dy
        if (x >= 0 && x < size && y >= 0 && y < size) setFunction(x, y, dist !== 2 && dist !== 4)
      }
    }
  }
  const align = alignmentPositions(ver, size)
  const n = align.length
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      // Not over the three finder patterns
      if ((i === 0 && j === 0) || (i === 0 && j === n - 1) || (i === n - 1 && j === 0)) continue
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) setFunction(align[i] + dx, align[j] + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1)
      }
    }
  }
  drawFormatBits(setFunction, size, ecc, 0) // reserves the area; redrawn per mask
  if (ver >= 7) {
    let rem = ver
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1F25)
    const bits = ver << 12 | rem
    for (let i = 0; i < 18; i++) {
      const bit = ((bits >>> i) & 1) === 1
      const a = size - 11 + i % 3
      const b = Math.floor(i / 3)
      setFunction(a, b, bit)
      setFunction(b, a, bit)
    }
  }

  // Codewords zigzag through two-module columns, skipping function patterns
  let i = 0
  const total = codewords.length * 8
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5
    const upward = ((right + 1) & 2) === 0
    for (let vert = 0; vert < size; vert++) {
      const y = upward ? size - 1 - vert : vert
      for (let x = right; x > right - 2; x--) {
        const p = y * size + x
        if (isFunction[p] || i >= total) continue
        modules[p] = (codewords[i >>> 3] >>> (7 - (i & 7))) & 1
        i++
      }
    }
  }

  // Try each mask on a copy, keep the lowest penalty
  let best: Uint8Array = modules
  let minPenalty = Infinity
  for (let mask = 0; mask < 8; mask++) {
    const candidate = modules.slice()
    const tile = MASK_TILES[mask]
    for (let y = 0, p = 0; y < size; y++) {
      const row = (y % 12) * 12
      for (let x = 0; x < size; x++, p++) {
        if (!isFunction[p]) candidate[p] ^= tile[row + x % 12]
      }
    }
    drawFormatBits((x, y, dark) => { candidate[y * size + x] = dark ? 1 : 0 }, size, ecc, mask)
    const score = penalty(candidate, size)
    if (score < minPenalty) {
      best = candidate
      minPenalty = score
    }
  }
  return { size, modules: best }
}

function alignmentPositions(ver: number, size: number) {
  if (ver === 1) return []
  const numAlign = Math.floor(ver / 7) + 2
  const step = Math.floor((ver * 8 + numAlign * 3 + 5) / (numAlign * 4 - 4)) * 2
  const result = [6]
  for (let pos = size - 7; result.length < numAlign; pos -= step) result.splice(1, 0, pos)
  return result
}

function drawFormatBits(set: (x: number, y: number, dark: boolean) => void, size: number, ecc: Ecc, mask: number) {
  const data = FORMAT_BITS[ecc] << 3 | mask
  let rem = data
  for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537)
  const bits = (data << 10 | rem) ^ 0x5412
  const bit = (i: number) => ((bits >>> i) & 1) === 1

  // Around the top-left finder
  for (let i = 0; i <= 5; i++) set(8, i, bit(i))
  set(8, 7, bit(6))
  set(8, 8, bit(7))
  set(7, 8, bit(8))
  for (let i = 9; i < 15; i++) set(14 - i, 8, bit(i))
  // Split between the other two finders
  for (let i = 0; i < 8; i++) set(size - 1 - i, 8, bit(i))
  for (let i = 8; i < 15; i++) set(8, size - 15 + i, bit(i))
  set(8, size - 8, true) // always dark
}

// The standard's penalty rules: N1 runs of 5+, N2 2x2 blocks, N3 finder-like
// 1:1:3:1:1 patterns, N4 dark/light balance. Hot (eight masks), so the run
// history is seven plain variables, h0 the newest run.
function penalty(m: Uint8Array, size: number) {
  let result = 0
  let h0 = 0, h1 = 0, h2 = 0, h3 = 0, h4 = 0, h5 = 0, h6 = 0
  // The first run of a line also counts the light border before it
  const push = (len: number) => {
    h6 = h5; h5 = h4; h4 = h3; h3 = h2; h2 = h1; h1 = h0
    h0 = h1 === 0 ? len + size : len
  }
  const finderLike = () => {
    const n = h1
    if (!(n > 0 && h2 === n && h3 === n * 3 && h4 === n && h5 === n)) return 0
    return (h0 >= n * 4 && h6 >= n ? 1 : 0) + (h6 >= n * 4 && h0 >= n ? 1 : 0)
  }

  for (let pass = 0; pass < 2; pass++) {
    // Rows: step 1 along a line, size between lines; columns the other way
    const along = pass === 0 ? 1 : size
    const across = pass === 0 ? size : 1
    for (let a = 0; a < size; a++) {
      h0 = h1 = h2 = h3 = h4 = h5 = h6 = 0
      let runColor = 0
      let runLen = 0
      for (let b = 0, p = a * across; b < size; b++, p += along) {
        const color = m[p]
        if (color === runColor) {
          runLen++
          if (runLen === 5) result += 3
          else if (runLen > 5) result++
        }
        else {
          push(runLen)
          if (!runColor) result += finderLike() * 40
          runColor = color
          runLen = 1
        }
      }
      // The light border beyond the end of the line
      if (runColor) {
        push(runLen)
        runLen = 0
      }
      push(runLen + size)
      result += finderLike() * 40
    }
  }

  let dark = 0
  for (let y = 0; y < size; y++) {
    for (let x = 0, p = y * size; x < size; x++, p++) {
      const c = m[p]
      dark += c
      if (x < size - 1 && y < size - 1 && c === m[p + 1] && c === m[p + size] && c === m[p + size + 1]) result += 3
    }
  }
  const total = size * size
  return result + (Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1) * 10
}

/**
 * The dark modules as one SVG path in a viewBox of size + 2*border, each run of
 * dark modules in a row merged into one rectangle (a few hundred commands
 * instead of thousands of <rect>s).
 */
export function qrPath({ size, modules }: QrMatrix, border: number) {
  let d = ''
  for (let y = 0; y < size; y++) {
    for (let x = 0, p = y * size; x < size; x++, p++) {
      if (!modules[p]) continue
      const start = x
      while (x + 1 < size && modules[p + 1]) {
        x++
        p++
      }
      d += `M${start + border} ${y + border}h${x - start + 1}v1h${start - x - 1}z`
    }
  }
  return d
}
