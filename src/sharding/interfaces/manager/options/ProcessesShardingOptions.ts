import Process from 'child_process'

export interface ProcessesShardingOptions {
  shardsPerProcess?: number
  env?: Record<string, string>
  forkOptions?: Omit<Process.ForkOptions, 'env'>
}
