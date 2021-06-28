import { ShardingClientEnvironment } from '@src/sharding/interfaces/client/ShardingClientEnvironment'
import { PartialShardingModes } from '@src/core/Constants'
import { IpcClientTlsOptions } from '@src/sharding/interfaces/ipc/IpcClientTlsOptions'
import { RawIpcConfig } from '@src/sharding/interfaces/ipc/RawIpcConfig'
import { ClustersShardingOptions, ProcessesShardingOptions, WorkersShardingOptions } from '@src/sharding'

export interface ShardingClientOptions {
  env: ShardingClientEnvironment
  shards: number[]
  totalShards: number
  mode: PartialShardingModes
  file: string
  extraOptions?: ProcessesShardingOptions | WorkersShardingOptions | ClustersShardingOptions
  ipc?: {
    tls?: IpcClientTlsOptions
    config?: RawIpcConfig
  }
}
