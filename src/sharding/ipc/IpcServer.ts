import { TypedEmitter } from 'tiny-typed-emitter'
import IpcServerOptions from '@src/sharding/interfaces/ipc/IpcServerOptions'
import { IPC as RawIpc, server as RawIpcServer } from 'node-ipc'

export default class IpcServer extends TypedEmitter {
  public ipc: InstanceType<typeof RawIpc>
  public ipcServer?: typeof RawIpcServer

  public id: string
  public mode

  constructor(options: IpcServerOptions) {
    super()

    this.ipc = new RawIpc()
    this.id = this.ipc.config.id = options.id
    this.ipc.config = Object.assign(this.ipc.config, options.config || {})
  }
}
