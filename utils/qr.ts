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

const getBit = (x: number, i: number) => ((x >>> i) & 1) !== 0

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

// GF(2^8) arithmetic modulo x^8 + x^4 + x^3 + x^2 + 1, for Reed-Solomon ECC
function gfMultiply(x: number, y: number) {
  let z = 0
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11D)
    z ^= ((y >>> i) & 1) * x
  }
  return z
}

function rsDivisor(degree: number) {
  const result = new Uint8Array(degree)
  result[degree - 1] = 1
  let root = 1
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < degree; j++) {
      result[j] = gfMultiply(result[j], root)
      if (j + 1 < degree) result[j] ^= result[j + 1]
    }
    root = gfMultiply(root, 0x02)
  }
  return result
}

function rsRemainder(data: ArrayLike<number>, divisor: Uint8Array) {
  const result = new Uint8Array(divisor.length)
  for (let k = 0; k < data.length; k++) {
    const factor = data[k] ^ result[0]
    result.copyWithin(0, 1)
    result[result.length - 1] = 0
    for (let i = 0; i < divisor.length; i++) result[i] ^= gfMultiply(divisor[i], factor)
  }
  return result
}

export interface QrMatrix {
  size: number
  // size*size, row-major; 1 = dark module
  modules: Uint8Array
}

/**
 * Encode `text` (UTF-8) at the smallest version that fits. With `boost`, the
 * error correction is raised as far as it goes without a bigger symbol.
 */
export function encodeQr(text: string, ecc: Ecc = 'M', boost = true): QrMatrix {
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

  // Data codewords: segment, terminator, byte padding, pad bytes
  const capacity = numDataCodewords(ver, ecc) * 8
  const bits: number[] = []
  const push = (val: number, len: number) => { for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1) }
  push(0b0100, 4)
  push(bytes.length, ver <= 9 ? 8 : 16)
  for (const b of bytes) push(b, 8)
  push(0, Math.min(4, capacity - bits.length))
  push(0, (8 - bits.length % 8) % 8)
  for (let pad = 0xEC; bits.length < capacity; pad ^= 0xEC ^ 0x11) push(pad, 8)
  const data = new Uint8Array(bits.length / 8)
  for (let i = 0; i < bits.length; i++) data[i >>> 3] |= bits[i] << (7 - (i & 7))

  return new QrSymbol(ver, ecc).draw(interleave(data, ver, ecc))
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

class QrSymbol {
  private ver: number
  private ecc: Ecc
  private size: number
  private modules: Uint8Array
  private isFunction: Uint8Array

  constructor(ver: number, ecc: Ecc) {
    this.ver = ver
    this.ecc = ecc
    this.size = ver * 4 + 17
    this.modules = new Uint8Array(this.size * this.size)
    this.isFunction = new Uint8Array(this.size * this.size)
  }

  draw(codewords: Uint8Array): QrMatrix {
    this.drawFunctionPatterns()
    this.drawCodewords(codewords)

    // The mask with the lowest penalty
    let best = 0
    let minPenalty = Infinity
    for (let mask = 0; mask < 8; mask++) {
      this.applyMask(mask)
      this.drawFormatBits(mask)
      const penalty = this.penalty()
      if (penalty < minPenalty) {
        best = mask
        minPenalty = penalty
      }
      this.applyMask(mask) // XOR again undoes it
    }
    this.applyMask(best)
    this.drawFormatBits(best)
    return { size: this.size, modules: this.modules }
  }

  private get(x: number, y: number) { return this.modules[y * this.size + x] === 1 }

  private setFunction(x: number, y: number, dark: boolean) {
    this.modules[y * this.size + x] = dark ? 1 : 0
    this.isFunction[y * this.size + x] = 1
  }

  private drawFunctionPatterns() {
    const size = this.size
    for (let i = 0; i < size; i++) {
      this.setFunction(6, i, i % 2 === 0)
      this.setFunction(i, 6, i % 2 === 0)
    }
    this.drawFinder(3, 3)
    this.drawFinder(size - 4, 3)
    this.drawFinder(3, size - 4)

    const pos = this.alignmentPositions()
    const n = pos.length
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        // Not over the three finder patterns
        if (!((i === 0 && j === 0) || (i === 0 && j === n - 1) || (i === n - 1 && j === 0))) this.drawAlignment(pos[i], pos[j])
      }
    }
    this.drawFormatBits(0) // reserves the area; redrawn after masking
    this.drawVersion()
  }

  private drawFinder(x: number, y: number) {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const dist = Math.max(Math.abs(dx), Math.abs(dy))
        const xx = x + dx
        const yy = y + dy
        if (xx >= 0 && xx < this.size && yy >= 0 && yy < this.size) this.setFunction(xx, yy, dist !== 2 && dist !== 4)
      }
    }
  }

  private drawAlignment(x: number, y: number) {
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) this.setFunction(x + dx, y + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1)
    }
  }

  private alignmentPositions() {
    if (this.ver === 1) return []
    const numAlign = Math.floor(this.ver / 7) + 2
    const step = Math.floor((this.ver * 8 + numAlign * 3 + 5) / (numAlign * 4 - 4)) * 2
    const result = [6]
    for (let pos = this.size - 7; result.length < numAlign; pos -= step) result.splice(1, 0, pos)
    return result
  }

  private drawFormatBits(mask: number) {
    const data = FORMAT_BITS[this.ecc] << 3 | mask
    let rem = data
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537)
    const bits = (data << 10 | rem) ^ 0x5412
    const size = this.size

    // Around the top-left finder
    for (let i = 0; i <= 5; i++) this.setFunction(8, i, getBit(bits, i))
    this.setFunction(8, 7, getBit(bits, 6))
    this.setFunction(8, 8, getBit(bits, 7))
    this.setFunction(7, 8, getBit(bits, 8))
    for (let i = 9; i < 15; i++) this.setFunction(14 - i, 8, getBit(bits, i))
    // Split between the other two finders
    for (let i = 0; i < 8; i++) this.setFunction(size - 1 - i, 8, getBit(bits, i))
    for (let i = 8; i < 15; i++) this.setFunction(8, size - 15 + i, getBit(bits, i))
    this.setFunction(8, size - 8, true) // always dark
  }

  private drawVersion() {
    if (this.ver < 7) return
    let rem = this.ver
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1F25)
    const bits = this.ver << 12 | rem
    for (let i = 0; i < 18; i++) {
      const bit = getBit(bits, i)
      const a = this.size - 11 + i % 3
      const b = Math.floor(i / 3)
      this.setFunction(a, b, bit)
      this.setFunction(b, a, bit)
    }
  }

  // Zigzag through the symbol in two-module columns, skipping function patterns
  private drawCodewords(data: Uint8Array) {
    const size = this.size
    let i = 0
    for (let right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5
      for (let vert = 0; vert < size; vert++) {
        for (let j = 0; j < 2; j++) {
          const x = right - j
          const upward = ((right + 1) & 2) === 0
          const y = upward ? size - 1 - vert : vert
          if (!this.isFunction[y * size + x] && i < data.length * 8) {
            this.modules[y * size + x] = getBit(data[i >>> 3], 7 - (i & 7)) ? 1 : 0
            i++
          }
        }
      }
    }
  }

  private applyMask(mask: number) {
    const size = this.size
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        let invert: boolean
        switch (mask) {
          case 0: invert = (x + y) % 2 === 0; break
          case 1: invert = y % 2 === 0; break
          case 2: invert = x % 3 === 0; break
          case 3: invert = (x + y) % 3 === 0; break
          case 4: invert = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0; break
          case 5: invert = x * y % 2 + x * y % 3 === 0; break
          case 6: invert = (x * y % 2 + x * y % 3) % 2 === 0; break
          default: invert = ((x + y) % 2 + x * y % 3) % 2 === 0
        }
        if (invert && !this.isFunction[y * size + x]) this.modules[y * size + x] ^= 1
      }
    }
  }

  // The standard's penalty rules (N1 runs, N2 blocks, N3 finder-like, N4 balance)
  private penalty() {
    const size = this.size
    let result = 0
    for (const byRow of [true, false]) {
      for (let a = 0; a < size; a++) {
        let runColor = false
        let runLen = 0
        const history = [0, 0, 0, 0, 0, 0, 0]
        for (let b = 0; b < size; b++) {
          const color = byRow ? this.get(b, a) : this.get(a, b)
          if (color === runColor) {
            runLen++
            if (runLen === 5) result += 3
            else if (runLen > 5) result++
          }
          else {
            this.addHistory(runLen, history)
            if (!runColor) result += this.countFinderLike(history) * 40
            runColor = color
            runLen = 1
          }
        }
        result += this.terminateAndCount(runColor, runLen, history) * 40
      }
    }

    let dark = 0
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const c = this.get(x, y)
        if (c) dark++
        if (x < size - 1 && y < size - 1 && c === this.get(x + 1, y) && c === this.get(x, y + 1) && c === this.get(x + 1, y + 1)) result += 3
      }
    }
    const total = size * size
    const k = Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1
    return result + k * 10
  }

  private countFinderLike(h: number[]) {
    const n = h[1]
    const core = n > 0 && h[2] === n && h[3] === n * 3 && h[4] === n && h[5] === n
    return (core && h[0] >= n * 4 && h[6] >= n ? 1 : 0) + (core && h[6] >= n * 4 && h[0] >= n ? 1 : 0)
  }

  private terminateAndCount(runColor: boolean, runLen: number, h: number[]) {
    if (runColor) {
      this.addHistory(runLen, h)
      runLen = 0
    }
    this.addHistory(runLen + this.size, h) // light border beyond the edge
    return this.countFinderLike(h)
  }

  private addHistory(runLen: number, h: number[]) {
    if (h[0] === 0) runLen += this.size // the first run is also next to the light border
    h.pop()
    h.unshift(runLen)
  }
}

/**
 * The dark modules as one SVG path in a viewBox of size + 2*border, each run of
 * dark modules in a row merged into one rectangle (a few hundred commands
 * instead of thousands of <rect>s).
 */
export function qrPath({ size, modules }: QrMatrix, border: number) {
  let d = ''
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!modules[y * size + x]) continue
      const start = x
      while (x + 1 < size && modules[y * size + x + 1]) x++
      d += `M${start + border} ${y + border}h${x - start + 1}v1h${start - x - 1}z`
    }
  }
  return d
}
