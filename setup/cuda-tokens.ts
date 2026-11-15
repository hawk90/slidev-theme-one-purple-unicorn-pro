// The CUDA names the transformer colors (cuda-transformer.ts): each group's
// words, color and weight. Data only.

export interface TokenDef {
  words: string
  color: string
  bold?: boolean
  italic?: boolean
}

export const cudaTokens: TokenDef[] = [
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
