import { ShardingClientEnvironment } from '@src/sharding/interfaces/client/ShardingClientEnvironment'
import { PartialShardingModes } from '@src/core/Constants'
import { IpcClientTlsOptions } from '@src/sharding/interfaces/ipc/IpcClientTlsOptions'
import { RawIpcConfig } from '@src/sharding/interfaces/ipc/RawIpcConfig'

export interface ShardingClientOptions {
  env: ShardingClientEnvironment
  ipc?: {
    tls?: IpcClientTlsOptions
    config?: RawIpcConfig
  }
  shards: number[]
  totalShards: number
  mode: PartialShardingModes
  file: string
}
