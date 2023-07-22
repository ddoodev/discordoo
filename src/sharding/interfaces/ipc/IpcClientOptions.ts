import { IpcClientTlsOptions } from '@src/sharding/interfaces/ipc/IpcClientTlsOptions'
import { RawIpcConfig } from '@src/sharding/interfaces/ipc/RawIpcConfig'

export interface IpcClientOptions {
  tls?: IpcClientTlsOptions
  config?: RawIpcConfig
  INSTANCE_IPC: string
  MANAGER_IPC: string
  shards: number[]
  totalShards: number
}
