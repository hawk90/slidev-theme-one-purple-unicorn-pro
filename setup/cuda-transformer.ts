// CUDA Syntax Transformer for Shiki
// Only runs on cpp code blocks, adds CUDA-specific highlighting on top of C++ base

import type { ShikiTransformer } from 'shiki'

interface TokenDef {
  pattern: RegExp
  color: string
  bold?: boolean
  italic?: boolean
}

// CUDA-only tokens (does NOT include C++ base - that's handled by shiki theme)
const cudaTokens: TokenDef[] = [
  // --- CUDA execution qualifiers ---
  {
    pattern: /\b(__global__|__device__|__host__|__shared__|__constant__|__managed__|__restrict__|__noinline__|__forceinline__|__launch_bounds__)\b/g,
    color: '#ff6188',
    bold: true,
  },
  // --- Kernel launch syntax <<<>>> ---
  // Note: shiki splits <<< into << + <, so match partial sequences too
  {
    pattern: />{3}|<{2,3}/g,
    color: '#ff6188',
    bold: true,
  },
  // Kernel function name is handled in pre() hook (cross-span matching)

  // --- ALL_CAPS constants (tree-sitter: @constant) ---
  {
    pattern: /\b([A-Z][A-Z0-9_]{2,})\b/g,
    color: '#d19a66',
    bold: true,
  },
  // --- Preprocessor directives (#define, #include, etc.) ---
  {
    pattern: /#\s*(include|define|ifdef|ifndef|endif|if|elif|else|pragma|undef|error|warning)\b/g,
    color: '#c678dd',
  },
  // --- Macro function-like names after #define (tree-sitter: @function.special) ---
  {
    pattern: /(?<=#define\s+)([A-Z_][A-Z0-9_]*)/g,
    color: '#61afef',
    bold: true,
  },
  // --- Arrow operator -> (tree-sitter: @operator) ---
  {
    pattern: /->/g,
    color: '#c678dd',
  },
  // --- Scope resolution :: ---
  {
    pattern: /::/g,
    color: '#c678dd',
  },
  // --- CUDA built-in variables ---
  {
    pattern: /\b(threadIdx|blockIdx|blockDim|gridDim|warpSize)\b/g,
    color: '#ff6188',
  },
  // --- Member access .x .y .z .w ---
  {
    pattern: /\.([xyzw])\b/g,
    color: '#fc9867',
  },
  // --- Array index content (inside []) ---
  {
    pattern: /(?<=\[)[^\]]+(?=\])/g,
    color: '#e5c07b',
    italic: true,
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

function processSpan(span: any) {
  if (span.type !== 'element' || span.tagName !== 'span') return
  if (!span.children) return

  const newChildren: any[] = []

  for (const child of span.children) {
    if (child.type !== 'text') {
      newChildren.push(child)
      continue
    }

    const text = child.value

    // Find all matches
    const matches: { start: number; end: number; token: TokenDef }[] = []
    for (const token of cudaTokens) {
      token.pattern.lastIndex = 0
      let m
      while ((m = token.pattern.exec(text)) !== null) {
        matches.push({ start: m.index, end: m.index + m[0].length, token })
      }
    }

    matches.sort((a, b) => a.start - b.start)

    // Remove overlapping (keep first)
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

// Extract text from a HAST node recursively
function getNodeText(node: any): string {
  if (node.type === 'text') return node.value || ''
  if (node.children) return node.children.map(getNodeText).join('')
  return ''
}

// Find all spans in a line (flattened)
function collectSpans(node: any, result: any[] = []): any[] {
  if (node.type === 'element' && node.tagName === 'span') {
    result.push(node)
  }
  if (node.children) {
    for (const child of node.children) {
      collectSpans(child, result)
    }
  }
  return result
}

// Mark kernel function names: find spans whose text ends with an identifier
// followed by a span containing <<
function markKernelFunctions(codeNode: any) {
  const lines = codeNode.children?.filter((c: any) => c.type === 'element' && c.tagName === 'span') || []

  for (const line of lines) {
    const spans = collectSpans(line)

    for (let i = 0; i < spans.length - 1; i++) {
      const thisText = getNodeText(spans[i])
      const nextText = getNodeText(spans[i + 1])

      // If next span starts with << (kernel launch), current span has the function name
      if (nextText.match(/^<{2,3}/)) {
        const funcMatch = thisText.match(/\b([a-zA-Z_]\w*)\s*$/)
        if (funcMatch) {
          // Apply kernel function style to this span
          const existingStyle = spans[i].properties?.style || ''
          spans[i].properties = spans[i].properties || {}
          spans[i].properties.style = existingStyle.replace(/color:[^;]+;?/, '') + 'color:#a9dc76;font-weight:bold;'
        }
      }
    }
  }
}

export function cudaTransformer(): ShikiTransformer {
  let isCpp = false

  return {
    name: 'cuda-highlighter',
    pre(node) {
      // Check if this code block is C++ (cpp, c, cuda)
      const code = node.children?.find((c: any) => c.tagName === 'code')
      const classes = (code?.properties?.class || []) as string[]
      isCpp = classes.some((c: string) =>
        c.includes('language-cpp') || c.includes('language-c') || c.includes('language-cuda')
      )

      // Mark kernel function names (cross-span matching)
      if (isCpp && code) {
        markKernelFunctions(code)
      }
    },
    span(node) {
      if (isCpp) {
        processSpan(node)
      }
    },
  }
}
