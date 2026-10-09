// CUDA Syntax Transformer for Shiki
// Adds CUDA-specific highlighting on top of C++ base colors
// CUDA patterns are unique enough to apply to all code blocks safely

import type { ShikiTransformer } from 'shiki'

// HAST node types, taken from Shiki's own hook signatures (no extra dependency)
type Element = Parameters<NonNullable<ShikiTransformer['span']>>[0]
type Content = Element['children'][number]
type Root = Parameters<NonNullable<ShikiTransformer['root']>>[0]
type Node = Root | Root['children'][number]

interface TokenDef {
  pattern: RegExp
  color: string
  bold?: boolean
  italic?: boolean
}

const cudaTokens: TokenDef[] = [
  // --- CUDA execution qualifiers ---
  {
    pattern: /\b(__global__|__device__|__host__|__shared__|__constant__|__managed__|__restrict__|__noinline__|__forceinline__|__launch_bounds__)\b/g,
    color: '#ff6188',
    bold: true,
  },
  // --- CUDA built-in variables ---
  {
    pattern: /\b(threadIdx|blockIdx|blockDim|gridDim|warpSize)\b/g,
    color: '#ff6188',
  },
  // --- Synchronization & warp intrinsics ---
  {
    pattern: /\b(__syncthreads|__syncwarp|__threadfence|__threadfence_block|__threadfence_system|__ballot_sync|__all_sync|__any_sync|__shfl_sync|__shfl_up_sync|__shfl_down_sync|__shfl_xor_sync)\b/g,
    color: '#78dce8',
  },
  // --- Atomic operations ---
  {
    pattern: /\b(atomicAdd|atomicSub|atomicExch|atomicMin|atomicMax|atomicInc|atomicDec|atomicCAS|atomicAnd|atomicOr|atomicXor)\b/g,
    color: '#78dce8',
  },
  // --- CUDA Runtime API ---
  {
    pattern: /\b(cudaMalloc|cudaMallocHost|cudaMallocManaged|cudaMallocPitch|cudaMalloc3D|cudaFree|cudaFreeHost|cudaMemcpy|cudaMemcpyAsync|cudaMemcpy2D|cudaMemcpyToSymbol|cudaMemcpyFromSymbol|cudaMemset|cudaMemsetAsync|cudaMemGetInfo|cudaMemPrefetchAsync|cudaMemAdvise)\b/g,
    color: '#78dce8',
    bold: true,
  },
  // --- CUDA Device API ---
  {
    pattern: /\b(cudaGetDevice|cudaSetDevice|cudaGetDeviceCount|cudaGetDeviceProperties|cudaDeviceGetAttribute|cudaDeviceSynchronize|cudaDeviceReset|cudaDeviceCanAccessPeer|cudaDeviceEnablePeerAccess|cudaDeviceGetLimit|cudaDeviceSetLimit|cudaDeviceGetCacheConfig|cudaDeviceSetCacheConfig)\b/g,
    color: '#78dce8',
    bold: true,
  },
  // --- CUDA Stream/Event API ---
  {
    pattern: /\b(cudaStreamCreate|cudaStreamCreateWithFlags|cudaStreamCreateWithPriority|cudaStreamDestroy|cudaStreamSynchronize|cudaStreamWaitEvent|cudaStreamQuery|cudaEventCreate|cudaEventCreateWithFlags|cudaEventDestroy|cudaEventRecord|cudaEventSynchronize|cudaEventElapsedTime|cudaEventQuery)\b/g,
    color: '#78dce8',
    bold: true,
  },
  // --- CUDA Error API ---
  {
    pattern: /\b(cudaGetLastError|cudaPeekAtLastError|cudaGetErrorString|cudaGetErrorName|cudaSuccess)\b/g,
    color: '#78dce8',
    bold: true,
  },
  // --- CUDA Occupancy/Launch API ---
  {
    pattern: /\b(cudaOccupancyMaxActiveBlocksPerMultiprocessor|cudaOccupancyMaxPotentialBlockSize|cudaFuncGetAttributes|cudaFuncSetAttribute|cudaFuncSetCacheConfig|cudaLaunchKernel|cudaLaunchCooperativeKernel|cudaHostAlloc|cudaHostRegister|cudaHostUnregister|cudaHostGetDevicePointer)\b/g,
    color: '#78dce8',
    bold: true,
  },
  // --- CUDA Graph API ---
  {
    pattern: /\b(cudaGraphCreate|cudaGraphDestroy|cudaGraphLaunch|cudaGraphInstantiate|cudaGraphExecDestroy|cudaGraphAddKernelNode|cudaGraphAddMemcpyNode|cudaGraphAddMemsetNode)\b/g,
    color: '#78dce8',
    bold: true,
  },
  // --- CUDA Types ---
  {
    pattern: /\b(dim3|cudaError_t|cudaStream_t|cudaEvent_t|cudaDeviceProp|cudaMemcpyKind|cudaFuncAttributes|cudaGraph_t|cudaGraphExec_t|cudaPointerAttributes|cudaChannelFormatDesc|cudaPitchedPtr|cudaExtent)\b/g,
    color: '#a9dc76',
  },
  // --- CUDA Enum Constants ---
  {
    pattern: /\b(cudaMemcpyHostToDevice|cudaMemcpyDeviceToHost|cudaMemcpyDeviceToDevice|cudaMemcpyHostToHost|cudaMemcpyDefault|cudaErrorMemoryAllocation|cudaErrorInvalidValue|cudaErrorInvalidDevice|cudaStreamDefault|cudaStreamNonBlocking|cudaEventDefault|cudaEventBlockingSync|cudaEventDisableTiming|cudaHostAllocDefault|cudaHostAllocPortable|cudaHostAllocMapped|cudaMemAttachGlobal|cudaMemAttachHost|cudaFuncCachePreferNone|cudaFuncCachePreferShared|cudaFuncCachePreferL1|cudaFuncCachePreferEqual)\b/g,
    color: '#fc9867',
  },
  // --- CUDA Math Intrinsics ---
  {
    pattern: /\b(__float2half|__half2float|__float2int_rn|__int2float_rn|__float_as_int|__int_as_float|__fmaf_rn|__fmul_rn|__fadd_rn|__fdiv_rn|__fsqrt_rn|__expf|__logf|__log2f|__sinf|__cosf|__tanf|__powf|rsqrtf|fmaf|__saturatef|__clz|__ffs|__popc|__brev|__ldg|__ldca|__ldcs)\b/g,
    color: '#78dce8',
    italic: true,
  },
]

function processSpan(span: Element) {
  if (span.tagName !== 'span' || !span.children) return

  const newChildren: Content[] = []

  for (const child of span.children) {
    if (child.type !== 'text') {
      newChildren.push(child)
      continue
    }

    const text = child.value
    const matches: { start: number; end: number; token: TokenDef }[] = []

    for (const token of cudaTokens) {
      token.pattern.lastIndex = 0
      let m
      while ((m = token.pattern.exec(text)) !== null) {
        matches.push({ start: m.index, end: m.index + m[0].length, token })
      }
    }

    matches.sort((a, b) => a.start - b.start)

    // Remove overlapping (keep first match)
    const filtered: typeof matches = []
    let lastEnd = 0
    for (const m of matches) {
      if (m.start >= lastEnd) {
        filtered.push(m)
        lastEnd = m.end
      }
    }

    if (filtered.length === 0) {
      newChildren.push(child)
      continue
    }

    let lastIndex = 0
    for (const m of filtered) {
      if (m.start > lastIndex) {
        newChildren.push({ type: 'text', value: text.slice(lastIndex, m.start) })
      }
      let style = `color:${m.token.color};`
      if (m.token.bold) style += 'font-weight:bold;'
      if (m.token.italic) style += 'font-style:italic;'
      newChildren.push({
        type: 'element',
        tagName: 'span',
        properties: { style },
        children: [{ type: 'text', value: text.slice(m.start, m.end) }],
      })
      lastIndex = m.end
    }
    if (lastIndex < text.length) {
      newChildren.push({ type: 'text', value: text.slice(lastIndex) })
    }
  }

  span.children = newChildren
}

const LAUNCH_STYLE = 'color:#ff6188;font-weight:bold;'
const KERNEL_STYLE = 'color:#a9dc76;font-weight:bold;'

// A kernel launch: name, optional template arguments, <<<config>>>
const LAUNCH = /\b([A-Za-z_]\w*)\s*(?:<[^<>;]*>\s*)?(<<<)[^;]*?(>>>)/g

// The text nodes of a line, in order, with their parent and offset in the line
function textNodes(node: Node, out: { parent: Element, index: number, start: number }[] = [], pos = { at: 0 }, parent?: Element) {
  if (!('children' in node)) return out
  node.children.forEach((child, index) => {
    if (child.type === 'text' && parent) {
      out.push({ parent, index, start: pos.at })
      pos.at += child.value.length
    }
    else if (child.type === 'element') {
      textNodes(child, out, pos, child)
    }
  })
  return out
}

// Cross-span: style the kernel name and the <<< >>> of each launch. Shiki
// splits them unpredictably (`<<` + `<`, or `<float><<<` in one span), so
// ranges are found on the line's text and the text nodes split to fit.
function markKernelLaunch(codeNode: Element) {
  for (const line of codeNode.children) {
    if (line.type !== 'element') continue
    const nodes = textNodes(line)
    const text = nodes.map(n => (n.parent.children[n.index] as { value: string }).value).join('')
    if (!text.includes('<<<')) continue

    const ranges: { start: number, end: number, style: string }[] = []
    for (const m of text.matchAll(LAUNCH)) {
      const at = m.index!
      ranges.push({ start: at, end: at + m[1].length, style: KERNEL_STYLE })
      const open = at + m[0].indexOf('<<<', m[1].length)
      ranges.push({ start: open, end: open + 3, style: LAUNCH_STYLE })
      const close = at + m[0].length - 3
      ranges.push({ start: close, end: close + 3, style: LAUNCH_STYLE })
    }
    if (!ranges.length) continue

    // Split each text node at the range edges, last node first so indexes hold
    for (const n of [...nodes].reverse()) {
      const value = (n.parent.children[n.index] as { value: string }).value
      const end = n.start + value.length
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

export function cudaTransformer(): ShikiTransformer {
  return {
    name: 'cuda-highlighter',
    pre(node) {
      const code = node.children.find((c): c is Element => c.type === 'element' && c.tagName === 'code')
      if (code) {
        markKernelLaunch(code)
      }
    },
    span(node) {
      processSpan(node)
    },
  }
}
