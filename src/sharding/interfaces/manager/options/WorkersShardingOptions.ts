import { WorkerOptions } from 'worker_threads'

export interface WorkersShardingOptions {
  env?: Record<string, string>
  spawnOptions?: Omit<WorkerOptions, 'env'>
}
