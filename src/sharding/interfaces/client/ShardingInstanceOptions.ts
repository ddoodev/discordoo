import { ShardingInstanceEnvironment } from '@src/sharding/interfaces/client/ShardingInstanceEnvironment'
import { PartialShardingModes } from '@src/constants'
import { IpcClientTlsOptions } from '@src/sharding/interfaces/ipc/IpcClientTlsOptions'
import { RawIpcConfig } from '@src/sharding/interfaces/ipc/RawIpcConfig'
import { ForkOptions as ProcessForkOptions } from 'child_process'
import { WorkerOptions } from 'worker_threads'

export interface ShardingInstanceOptions {
  internalEnv: ShardingInstanceEnvironment
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
