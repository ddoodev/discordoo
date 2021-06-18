import { TypedEmitter } from 'tiny-typed-emitter'
import ShardingManagerEvents from '@src/sharding/interfaces/manager/ShardingManagerEvents'
import { IPC as Ipc, server as IpcServer } from 'node-ipc'
import ShardingManagerOptions from '@src/sharding/interfaces/manager/options/ShardingManagerOptions'
import { ShardingModes } from '@src/core/Constants'

export default class ShardingManager extends TypedEmitter<ShardingManagerEvents> {
  public ipc: InstanceType<typeof Ipc>
  public server: typeof IpcServer

  private mode: ShardingModes

  constructor(public options: ShardingManagerOptions) {
    super()

    this.ipc = new Ipc()
    this.server = this.ipc.server

    this.mode = options.mode
  }

  start() {
    return 1
  }
}
