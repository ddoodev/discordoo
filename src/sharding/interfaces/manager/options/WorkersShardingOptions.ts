import { WorkerOptions } from 'worker_threads'

export interface WorkersShardingOptions {
  shardsPerWorker?: number
  env?: Record<string, string>
  spawnOptions?: Omit<WorkerOptions, 'env'>
}
