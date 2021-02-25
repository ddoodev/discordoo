import {ShardLike, ShardsManager} from '@discordoo/core'
import WebSocket from 'ws'
import WSModule from './WSModule'
import { Collection } from '@discordoo/collection'
import WSShard from './WSShard'
import worker_threads from 'worker_threads'
import EventEmitter from 'events'

export default class WebSocketManager extends EventEmitter implements ShardsManager<WebSocket> {
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
    const worker = new worker_threads.Worker(file, {
      workerData: JSON.stringify({ token: this.module!.client!.config.token, id })
    })
    this.shards.set(id, new WSShard(this, id, worker))
    await this.shards.get(id)!.connect()

    return this.shards.get(id)!
  }

  async startShards(file: string): Promise<void> {
    if (worker_threads.isMainThread) {
      if (Array.isArray(this.module.config.shards)) {
        for (const shard of this.module.config.shards as number[]) {
          await this.spawnShard(file, shard)
        }
      } else {
        for (let i = 1; i <= (this.module.config.shards as number); i++) {
          await this.spawnShard(file, i)
        }
      }
    }
  }
}
