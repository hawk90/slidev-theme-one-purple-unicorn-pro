// CUDA Syntax Transformer for Shiki
// Adds CUDA-specific highlighting on top of C++ base colors. It runs on every
// language (CUDA-Python decks use numba's cuda.threadIdx…), but not inside
// comments and strings (a "cudaMalloc failed" message stays a string).

import type { ShikiTransformer } from 'shiki'

// HAST node types, taken from Shiki's own hook signatures (no extra dependency)
type Element = Parameters<NonNullable<ShikiTransformer['span']>>[0]
type Content = Element['children'][number]
type Root = Parameters<NonNullable<ShikiTransformer['root']>>[0]
type Node = Root | Root['children'][number]

interface TokenDef {
  words: string
  color: string
  bold?: boolean
  italic?: boolean
}

const cudaTokens: TokenDef[] = [
  // --- CUDA execution qualifiers ---
  {
    words: '__global__ __device__ __host__ __shared__ __constant__ __managed__ __restrict__ __noinline__ __forceinline__ __launch_bounds__',
    color: '#ff6188',
    bold: true,
  },
  // --- CUDA built-in variables ---
  {
    words: 'threadIdx blockIdx blockDim gridDim warpSize',
    color: '#ff6188',
  },
  // --- Synchronization & warp intrinsics ---
  {
    words: '__syncthreads __syncwarp __threadfence __threadfence_block __threadfence_system __ballot_sync __all_sync __any_sync __shfl_sync __shfl_up_sync __shfl_down_sync __shfl_xor_sync',
    color: '#78dce8',
  },
  // --- Atomic operations ---
  {
    words: 'atomicAdd atomicSub atomicExch atomicMin atomicMax atomicInc atomicDec atomicCAS atomicAnd atomicOr atomicXor',
    color: '#78dce8',
  },
  // --- CUDA Runtime API ---
  {
    words: 'cudaMalloc cudaMallocHost cudaMallocManaged cudaMallocPitch cudaMalloc3D cudaFree cudaFreeHost cudaMemcpy cudaMemcpyAsync cudaMemcpy2D cudaMemcpyToSymbol cudaMemcpyFromSymbol cudaMemset cudaMemsetAsync cudaMemGetInfo cudaMemPrefetchAsync cudaMemAdvise',
    color: '#78dce8',
    bold: true,
  },
  // --- CUDA Device API ---
  {
    words: 'cudaGetDevice cudaSetDevice cudaGetDeviceCount cudaGetDeviceProperties cudaDeviceGetAttribute cudaDeviceSynchronize cudaDeviceReset cudaDeviceCanAccessPeer cudaDeviceEnablePeerAccess cudaDeviceGetLimit cudaDeviceSetLimit cudaDeviceGetCacheConfig cudaDeviceSetCacheConfig',
    color: '#78dce8',
    bold: true,
  },
  // --- CUDA Stream/Event API ---
  {
    words: 'cudaStreamCreate cudaStreamCreateWithFlags cudaStreamCreateWithPriority cudaStreamDestroy cudaStreamSynchronize cudaStreamWaitEvent cudaStreamQuery cudaEventCreate cudaEventCreateWithFlags cudaEventDestroy cudaEventRecord cudaEventSynchronize cudaEventElapsedTime cudaEventQuery',
    color: '#78dce8',
    bold: true,
  },
  // --- CUDA Error API ---
  {
    words: 'cudaGetLastError cudaPeekAtLastError cudaGetErrorString cudaGetErrorName cudaSuccess',
    color: '#78dce8',
    bold: true,
  },
  // --- CUDA Occupancy/Launch API ---
  {
    words: 'cudaOccupancyMaxActiveBlocksPerMultiprocessor cudaOccupancyMaxPotentialBlockSize cudaFuncGetAttributes cudaFuncSetAttribute cudaFuncSetCacheConfig cudaLaunchKernel cudaLaunchCooperativeKernel cudaHostAlloc cudaHostRegister cudaHostUnregister cudaHostGetDevicePointer',
    color: '#78dce8',
    bold: true,
  },
  // --- CUDA Graph API ---
  {
    words: 'cudaGraphCreate cudaGraphDestroy cudaGraphLaunch cudaGraphInstantiate cudaGraphExecDestroy cudaGraphAddKernelNode cudaGraphAddMemcpyNode cudaGraphAddMemsetNode',
    color: '#78dce8',
    bold: true,
  },
  // --- CUDA Types ---
  {
    words: 'dim3 cudaError_t cudaStream_t cudaEvent_t cudaDeviceProp cudaMemcpyKind cudaFuncAttributes cudaGraph_t cudaGraphExec_t cudaPointerAttributes cudaChannelFormatDesc cudaPitchedPtr cudaExtent',
    color: '#a9dc76',
  },
  // --- CUDA Enum Constants ---
  {
    words: 'cudaMemcpyHostToDevice cudaMemcpyDeviceToHost cudaMemcpyDeviceToDevice cudaMemcpyHostToHost cudaMemcpyDefault cudaErrorMemoryAllocation cudaErrorInvalidValue cudaErrorInvalidDevice cudaStreamDefault cudaStreamNonBlocking cudaEventDefault cudaEventBlockingSync cudaEventDisableTiming cudaHostAllocDefault cudaHostAllocPortable cudaHostAllocMapped cudaMemAttachGlobal cudaMemAttachHost cudaFuncCachePreferNone cudaFuncCachePreferShared cudaFuncCachePreferL1 cudaFuncCachePreferEqual',
    color: '#fc9867',
  },
  // --- CUDA Math Intrinsics ---
  {
    words: '__float2half __half2float __float2int_rn __int2float_rn __float_as_int __int_as_float __fmaf_rn __fmul_rn __fadd_rn __fdiv_rn __fsqrt_rn __expf __logf __log2f __sinf __cosf __tanf __powf rsqrtf fmaf __saturatef __clz __ffs __popc __brev __ldg __ldca __ldcs',
    color: '#78dce8',
    italic: true,
  },
]

// Each name with its style: one lookup per word, not 13 regexes per text
const STYLES = new Map<string, string>()
for (const { words, color, bold, italic } of cudaTokens) {
  const style = `color:${color};${bold ? 'font-weight:bold;' : ''}${italic ? 'font-style:italic;' : ''}`
  for (const word of words.split(' ')) STYLES.set(word, style)
}

// Comments and strings are recognized by their color in the Shiki theme
// (spans carry colors, not scopes): `comment` and `string` in its tokenColors
interface ThemeLike { tokenColors?: { scope?: string | string[], settings?: { foreground?: string } }[] }
export function quietColors(theme: ThemeLike) {
  return (theme.tokenColors ?? [])
    .filter(t => [t.scope ?? []].flat().some(s => s === 'comment' || s === 'string'))
    .map(t => t.settings?.foreground)
    .filter((c): c is string => !!c)
}
// The theme's own (setup/themes/one-purple-unicorn.json), when not given
const THEME_QUIET = ['#5c6370', '#98c379']

type IsQuiet = (el: Element) => boolean
const quietTest = (colors: string[]): IsQuiet => {
  const re = new RegExp(`color:\\s*(${colors.map(c => c.replace(/[^#\w]/g, '')).join('|')})\\b`, 'i')
  return (el: Element) => re.test(String(el.properties?.style ?? ''))
}

function processSpan(span: Element, isQuiet: IsQuiet) {
  if (span.tagName !== 'span' || !span.children || isQuiet(span)) return

  const newChildren: Content[] = []

  for (const child of span.children) {
    if (child.type !== 'text') {
      newChildren.push(child)
      continue
    }

    const text = child.value
    let lastIndex = 0
    // \w+, so a name inside a longer word (mydim3, dim3x) is not one. Shiki
    // splits a number from what follows: in `3dim3`, `dim3` is marked
    for (const m of text.matchAll(/\w+/g)) {
      const style = STYLES.get(m[0])
      if (!style) continue
      if (m.index > lastIndex) newChildren.push({ type: 'text', value: text.slice(lastIndex, m.index) })
      newChildren.push({ type: 'element', tagName: 'span', properties: { style }, children: [{ type: 'text', value: m[0] }] })
      lastIndex = m.index + m[0].length
    }
    if (lastIndex === 0) newChildren.push(child)
    else if (lastIndex < text.length) newChildren.push({ type: 'text', value: text.slice(lastIndex) })
  }

  span.children = newChildren
}

const LAUNCH_STYLE = 'color:#ff6188;font-weight:bold;'
const KERNEL_STYLE = 'color:#a9dc76;font-weight:bold;'

// A kernel launch: name, optional template arguments (one level of nesting:
// foo<std::vector<int>>), <<<config>>>
const LAUNCH = /\b([A-Za-z_]\w*)\s*(?:<(?:[^<>;]|<[^<>;]*>)*>\s*)?(<<<)[^;]*?(>>>)/g

interface TextNode { parent: Element, index: number, start: number, value: string, quiet: boolean }

// The text nodes of a line, in order, with their parent, offset in the line,
// and whether they are in a comment or string
function textNodes(node: Node, isQuiet: IsQuiet, out: TextNode[] = [], pos = { at: 0 }, parent?: Element, quiet = false) {
  if (!('children' in node)) return out
  node.children.forEach((child, index) => {
    if (child.type === 'text' && parent) {
      out.push({ parent, index, start: pos.at, value: child.value, quiet })
      pos.at += child.value.length
    }
    else if (child.type === 'element') {
      textNodes(child, isQuiet, out, pos, child, quiet || isQuiet(child))
    }
  })
  return out
}

// Cross-span: style the kernel name and the <<< >>> of each launch. Shiki
// splits them unpredictably (`<<` + `<`, or `<float><<<` in one span), so
// ranges are found on the line's text and the text nodes split to fit.
function markKernelLaunch(codeNode: Element, isQuiet: IsQuiet) {
  for (const line of codeNode.children) {
    if (line.type !== 'element') continue
    const nodes = textNodes(line, isQuiet)
    const text = nodes.map(n => n.value).join('')
    if (!text.includes('<<<')) continue

    const ranges: { start: number, end: number, style: string }[] = []
    const quietAt = (i: number) => nodes.some(n => n.quiet && i >= n.start && i < n.start + n.value.length)
    for (const m of text.matchAll(LAUNCH)) {
      const at = m.index!
      if (quietAt(at)) continue // in a comment or string
      ranges.push({ start: at, end: at + m[1].length, style: KERNEL_STYLE })
      const open = at + m[0].indexOf('<<<', m[1].length)
      ranges.push({ start: open, end: open + 3, style: LAUNCH_STYLE })
      const close = at + m[0].length - 3
      ranges.push({ start: close, end: close + 3, style: LAUNCH_STYLE })
    }
    if (!ranges.length) continue

    // Split each text node at the range edges, last node first so indexes hold
    for (const n of [...nodes].reverse()) {
      const end = n.start + n.value.length
      const cuts = ranges.filter(r => r.start < end && r.end > n.start)
      if (!cuts.length) continue
      const pieces: Content[] = []
      let at = n.start
      for (const r of cuts) {
        const a = Math.max(r.start, n.start)
        const b = Math.min(r.end, end)
        if (a > at) pieces.push({ type: 'text', value: text.slice(at, a) })
        pieces.push({ type: 'element', tagName: 'span', properties: { style: r.style }, children: [{ type: 'text', value: text.slice(a, b) }] })
        at = b
      }
      if (at < end) pieces.push({ type: 'text', value: text.slice(at, end) })
      n.parent.children.splice(n.index, 1, ...pieces)
    }
  }
}

/** `quiet`: the colors of comments and strings (quietColors(theme)), where
 *  names are left alone; by default this theme's */
export function cudaTransformer({ quiet = THEME_QUIET }: { quiet?: string[] } = {}): ShikiTransformer {
  const isQuiet = quietTest(quiet)
  return {
    name: 'cuda-highlighter',
    pre(node) {
      if (!this.source.includes('<<<')) return // no launch to mark
      const code = node.children.find((c): c is Element => c.type === 'element' && c.tagName === 'code')
      if (code) {
        markKernelLaunch(code, isQuiet)
      }
    },
    span(node) {
      processSpan(node, isQuiet)
    },
  }
}
