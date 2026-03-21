// CUDA TextMate Grammar - extends C++ with CUDA-specific syntax
// Registered as 'cuda' language in shiki

export const cudaGrammar = {
  name: 'cuda',
  scopeName: 'source.cuda-cpp',
  displayName: 'CUDA C++',
  patterns: [
    // --- CUDA kernel launch syntax <<<...>>> ---
    {
      name: 'meta.kernel-launch.cuda',
      begin: '(<<<)',
      end: '(>>>)',
      beginCaptures: {
        1: { name: 'punctuation.section.kernel-launch.begin.cuda' },
      },
      endCaptures: {
        1: { name: 'punctuation.section.kernel-launch.end.cuda' },
      },
      patterns: [
        { include: 'source.cpp' },
      ],
    },
    // --- CUDA execution space qualifiers ---
    {
      name: 'storage.modifier.cuda',
      match: '\\b(__global__|__device__|__host__|__shared__|__constant__|__managed__|__restrict__|__noinline__|__forceinline__)\\b',
    },
    // --- CUDA launch bounds ---
    {
      name: 'storage.modifier.cuda.launch-bounds',
      match: '\\b__launch_bounds__\\b',
    },
    // --- CUDA built-in variables ---
    {
      name: 'variable.language.cuda',
      match: '\\b(threadIdx|blockIdx|blockDim|gridDim|warpSize)\\b',
    },
    // --- CUDA built-in variable members (.x, .y, .z, .w) ---
    {
      match: '(\\.)([xyzw])\\b',
      captures: {
        1: { name: 'punctuation.accessor.cuda' },
        2: { name: 'variable.other.member.cuda' },
      },
    },
    // --- Array index access: variable[index] ---
    {
      name: 'meta.bracket.square.access.cuda',
      begin: '(\\[)',
      end: '(\\])',
      beginCaptures: {
        1: { name: 'punctuation.definition.index.begin.cuda' },
      },
      endCaptures: {
        1: { name: 'punctuation.definition.index.end.cuda' },
      },
      patterns: [
        // Index expressions (variables used as index)
        {
          name: 'variable.other.index.cuda',
          match: '\\b[a-zA-Z_][a-zA-Z0-9_]*\\b',
        },
        // Arithmetic in index
        {
          name: 'keyword.operator.index.cuda',
          match: '[+\\-*/%%]',
        },
        // Numbers in index
        {
          name: 'constant.numeric.index.cuda',
          match: '\\b[0-9]+\\b',
        },
      ],
    },
    // --- CUDA memory management API ---
    {
      name: 'support.function.cuda.memory',
      match: '\\b(cudaMalloc|cudaMallocHost|cudaMallocManaged|cudaMallocPitch|cudaMalloc3D|cudaMalloc3DArray|cudaMallocArray|cudaFree|cudaFreeHost|cudaFreeArray|cudaMemcpy|cudaMemcpyAsync|cudaMemcpy2D|cudaMemcpy2DAsync|cudaMemcpy3D|cudaMemcpy3DAsync|cudaMemcpyToSymbol|cudaMemcpyFromSymbol|cudaMemset|cudaMemsetAsync|cudaMemset2D|cudaMemset3D|cudaMemGetInfo|cudaMemPrefetchAsync|cudaMemAdvise)\\b',
    },
    // --- CUDA device management API ---
    {
      name: 'support.function.cuda.device',
      match: '\\b(cudaGetDevice|cudaSetDevice|cudaGetDeviceCount|cudaGetDeviceProperties|cudaDeviceGetAttribute|cudaDeviceSynchronize|cudaDeviceReset|cudaDeviceCanAccessPeer|cudaDeviceEnablePeerAccess|cudaDeviceDisablePeerAccess|cudaChooseDevice|cudaDeviceGetLimit|cudaDeviceSetLimit|cudaDeviceGetCacheConfig|cudaDeviceSetCacheConfig)\\b',
    },
    // --- CUDA stream API ---
    {
      name: 'support.function.cuda.stream',
      match: '\\b(cudaStreamCreate|cudaStreamCreateWithFlags|cudaStreamCreateWithPriority|cudaStreamDestroy|cudaStreamSynchronize|cudaStreamWaitEvent|cudaStreamQuery|cudaStreamAddCallback|cudaStreamBeginCapture|cudaStreamEndCapture)\\b',
    },
    // --- CUDA event API ---
    {
      name: 'support.function.cuda.event',
      match: '\\b(cudaEventCreate|cudaEventCreateWithFlags|cudaEventDestroy|cudaEventRecord|cudaEventSynchronize|cudaEventElapsedTime|cudaEventQuery)\\b',
    },
    // --- CUDA error handling API ---
    {
      name: 'support.function.cuda.error',
      match: '\\b(cudaGetLastError|cudaPeekAtLastError|cudaGetErrorString|cudaGetErrorName)\\b',
    },
    // --- CUDA occupancy API ---
    {
      name: 'support.function.cuda.occupancy',
      match: '\\b(cudaOccupancyMaxActiveBlocksPerMultiprocessor|cudaOccupancyMaxPotentialBlockSize|cudaOccupancyMaxPotentialBlockSizeVariableSMem|cudaFuncGetAttributes|cudaFuncSetAttribute|cudaFuncSetCacheConfig)\\b',
    },
    // --- CUDA graph API ---
    {
      name: 'support.function.cuda.graph',
      match: '\\b(cudaGraphCreate|cudaGraphDestroy|cudaGraphLaunch|cudaGraphInstantiate|cudaGraphExecDestroy|cudaGraphAddKernelNode|cudaGraphAddMemcpyNode|cudaGraphAddMemsetNode)\\b',
    },
    // --- CUDA texture/surface API ---
    {
      name: 'support.function.cuda.texture',
      match: '\\b(cudaCreateTextureObject|cudaDestroyTextureObject|cudaCreateSurfaceObject|cudaDestroySurfaceObject|cudaBindTexture|cudaUnbindTexture)\\b',
    },
    // --- CUDA unified memory / misc ---
    {
      name: 'support.function.cuda.misc',
      match: '\\b(cudaHostAlloc|cudaHostRegister|cudaHostUnregister|cudaHostGetDevicePointer|cudaLaunchKernel|cudaLaunchCooperativeKernel|cudaGetSymbolAddress|cudaGetSymbolSize|cudaDriverGetVersion|cudaRuntimeGetVersion|__syncthreads|__syncwarp|__threadfence|__threadfence_block|__threadfence_system|__ballot_sync|__all_sync|__any_sync|__shfl_sync|__shfl_up_sync|__shfl_down_sync|__shfl_xor_sync|atomicAdd|atomicSub|atomicExch|atomicMin|atomicMax|atomicInc|atomicDec|atomicCAS|atomicAnd|atomicOr|atomicXor)\\b',
    },
    // --- CUDA types ---
    {
      name: 'storage.type.cuda',
      match: '\\b(dim3|cudaError_t|cudaError|cudaStream_t|cudaEvent_t|cudaDeviceProp|cudaMemcpyKind|cudaFuncAttributes|cudaTextureObject_t|cudaSurfaceObject_t|cudaGraph_t|cudaGraphExec_t|cudaGraphNode_t|cudaPointerAttributes|cudaUUID_t|cudaChannelFormatDesc|cudaPitchedPtr|cudaExtent|cudaPos|cudaArray_t|cudaMipmappedArray_t|cudaResourceDesc|cudaTextureDesc|cudaResourceViewDesc)\\b',
    },
    // --- CUDA enum values ---
    {
      name: 'constant.language.cuda',
      match: '\\b(cudaMemcpyHostToDevice|cudaMemcpyDeviceToHost|cudaMemcpyDeviceToDevice|cudaMemcpyHostToHost|cudaMemcpyDefault|cudaSuccess|cudaErrorMemoryAllocation|cudaErrorInvalidValue|cudaErrorInvalidDevice|cudaStreamDefault|cudaStreamNonBlocking|cudaEventDefault|cudaEventBlockingSync|cudaEventDisableTiming|cudaHostAllocDefault|cudaHostAllocPortable|cudaHostAllocMapped|cudaHostAllocWriteCombined|cudaMemAttachGlobal|cudaMemAttachHost|cudaMemAttachSingle|cudaFuncCachePreferNone|cudaFuncCachePreferShared|cudaFuncCachePreferL1|cudaFuncCachePreferEqual|cudaSharedMemBankSizeDefault|cudaSharedMemBankSizeFourByte|cudaSharedMemBankSizeEightByte|cudaLimitStackSize|cudaLimitPrintfFifoSize|cudaLimitMallocHeapSize)\\b',
    },
    // --- CUDA math intrinsics ---
    {
      name: 'support.function.cuda.math',
      match: '\\b(__float2half|__half2float|__float2int_rn|__int2float_rn|__float_as_int|__int_as_float|__double_as_longlong|__longlong_as_double|__fmaf_rn|__fmul_rn|__fadd_rn|__fdiv_rn|__frcp_rn|__fsqrt_rn|__frsqrt_rn|__expf|__logf|__log2f|__log10f|__sinf|__cosf|__tanf|__powf|rsqrtf|fmaf|__saturatef|__clz|__clzll|__ffs|__ffsll|__popc|__popcll|__brev|__brevll|__byte_perm|__ldg|__ldca|__ldcs|__ldcg|__ldcv)\\b',
    },
    // --- Include C++ grammar for everything else ---
    { include: 'source.cpp' },
  ],
}
