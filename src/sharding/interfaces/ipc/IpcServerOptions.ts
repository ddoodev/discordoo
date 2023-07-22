import { IpcServerTlsOptions } from '@src/sharding/interfaces/ipc/IpcServerTlsOptions'
import { RawIpcConfig } from '@src/sharding/interfaces/ipc/RawIpcConfig'

export interface IpcServerOptions {
  tls?: IpcServerTlsOptions
  config?: RawIpcConfig
  MANAGER_IPC: string
  INSTANCE_IPC: string
  instance: number
}
