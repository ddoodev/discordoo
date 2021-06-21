import { TypedEmitter } from 'tiny-typed-emitter'
import ShardingClientOptions from '@src/sharding/interfaces/client/ShardingClientOptions'
import IpcClient from '@src/sharding/ipc/IpcClient'

export default class ShardingClient extends TypedEmitter {
  public env: any
  // public ipc: IpcClient

  constructor(options: ShardingClientOptions) {
    super()
  }
}
