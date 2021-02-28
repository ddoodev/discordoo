import { ShardLike, ShardsManager } from '@discordoo/core'
import WSModule from './WSModule'
import { Collection } from '@discordoo/collection'
import WSShard from './WSShard'
import worker_threads from 'worker_threads'
import EventEmitter from 'events'
import ConnectionShard from './ConnectionShard'

export default class WebSocketManager extends EventEmitter implements ShardsManager {
  module: WSModule
  shards: Collection<number, WSShard> = new Collection<number, WSShard>()

  get isCapitan() {
    return worker_threads.isMainThread
  }

  get all(): ShardLike {
    return {} as ShardLike
  }

  constructor(module: WSModule) {
    super()
    this.module = module
  }

  get(id: number): WSShard | undefined {
    return this.shards.get(id)
  }

  async spawnShard(file: string, id: number): Promise<WSShard> {
    const worker = new worker_threads.Worker(file)
    this.shards.set(id, new WSShard(this, id, worker))
    this.shards.get(id)!.sendProtocolMessage({
      event: 'HELLO',
      payload: {
        token: this.module!.client!.config.token,
        id,
        total: this.module.totalShards!
      }
    })
    await this.shards.get(id)!.connect()

    return this.shards.get(id)!
  }

  async startShards(file: string): Promise<void> {
    if (worker_threads.isMainThread) {
      if (Array.isArray(this.module.config.shards)) {
        for (const shard of this.module.config.shards as number[]) {
          await this.spawnShard(file, shard - 1)
        }
      } else {
        for (let i = 1; i <= (this.module.config.shards as number); i++) {
          await this.spawnShard(file, i - 1)
        }
      }
    } else {
      this.on('message', console.log)
      const cs = new ConnectionShard()
      cs.connect()
    }
  }
}
