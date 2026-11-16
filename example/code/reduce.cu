// A block-level sum, shown on the "Snippets from Source Files" slide.
#include <cstdio>
#include <cuda_runtime.h>

__global__ void reduce(const float *x, float *out, int n) {
    __shared__ float s[256];
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    s[threadIdx.x] = i < n ? x[i] : 0.0f;
    __syncthreads();
    for (int k = blockDim.x / 2; k > 0; k >>= 1) {
        if (threadIdx.x < k) s[threadIdx.x] += s[threadIdx.x + k];
        __syncthreads();
    }
    if (threadIdx.x == 0) atomicAdd(out, s[0]);
}

int main() {
    float *x, *out;
    cudaMallocManaged(&x, 1024 * sizeof(float));
    cudaMallocManaged(&out, sizeof(float));
    reduce<<<4, 256>>>(x, out, 1024);
    cudaDeviceSynchronize();
    printf("%f\n", *out);
}
