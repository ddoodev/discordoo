import Process from 'child_process'

export interface ProcessesShardingOptions {
  env?: Record<string, string>
  forkOptions?: Omit<Process.ForkOptions, 'env'>
}
