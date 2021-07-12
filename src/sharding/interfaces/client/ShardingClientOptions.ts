import { ShardingClientEnvironment } from '@src/sharding/interfaces/client/ShardingClientEnvironment'
import { PartialShardingModes } from '@src/core/Constants'
import { IpcClientTlsOptions } from '@src/sharding/interfaces/ipc/IpcClientTlsOptions'
import { RawIpcConfig } from '@src/sharding/interfaces/ipc/RawIpcConfig'
import { ForkOptions as ProcessForkOptions } from 'child_process'
import { WorkerOptions } from 'worker_threads'

export interface ShardingClientOptions {
  internalEnv: ShardingClientEnvironment
  shards: number[]
  totalShards: number
  mode: PartialShardingModes
  file: string
  spawnOptions?: ProcessForkOptions | WorkerOptions
  ipc?: {
    tls?: IpcClientTlsOptions
    config?: RawIpcConfig
  }
}
