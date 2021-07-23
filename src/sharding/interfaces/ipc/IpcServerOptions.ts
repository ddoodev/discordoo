import { IpcServerTlsOptions } from '@src/sharding/interfaces/ipc/IpcServerTlsOptions'
import { RawIpcConfig } from '@src/sharding/interfaces/ipc/RawIpcConfig'

export interface IpcServerOptions {
  tls?: IpcServerTlsOptions
  config?: RawIpcConfig
  managerIpc: string
  instance: number
  instanceIpc: string
}
