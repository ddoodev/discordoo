import { IpcClientTlsOptions } from '@src/sharding/interfaces/ipc/IpcClientTlsOptions'
import { RawIpcConfig } from '@src/sharding/interfaces/ipc/RawIpcConfig'

export interface IpcClientOptions {
  tls?: IpcClientTlsOptions
  config?: RawIpcConfig
  shardId: number
  shardIpcId: string
  managerId: string
  shards: number[]
  totalShards: number
}
