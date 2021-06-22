import IpcServerTlsOptions from '@src/sharding/interfaces/ipc/IpcServerTlsOptions'
import RawIpcConfig from '@src/sharding/interfaces/ipc/RawIpcConfig'

export default interface IpcServerOptions {
  tls?: IpcServerTlsOptions
  config?: RawIpcConfig
  managerIpcId: string
  shardId: number
  id: string
}
