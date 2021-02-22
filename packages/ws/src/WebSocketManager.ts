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

  async startShards(file: string): Promise<void> {
    if (worker_threads.isMainThread) {
      console.log('i am a big boy!!!!')
      if (Array.isArray(this.module.config.shards)) {
        for (const shard of this.module.config.shards as number[]) {
          const worker = new worker_threads.Worker(file, {
            workerData: JSON.stringify({token: this.module.config.token, id: shard})
          })
          worker.on('message', console.log)
          this.shards.set(shard, new WSShard(this, shard, worker))
          await this.shards.get(shard)!.connect()
        }
      } else {
        for (let i = 1; i <= (this.module.config.shards as number); i++) {
          console.log('a')
          const worker = new worker_threads.Worker(file, {
            workerData: JSON.stringify({token: this.module.config.token, id: i})
          })
          worker.on('message', console.log)
          this.shards.set(i, new WSShard(this, i, worker))
          await this.shards.get(i)!.connect()
        }
      }
    } else {
      console.log('i am a child')
      worker_threads.parentPort?.postMessage('IT\'S ALIVE!!!!!!!')
      worker_threads.parentPort?.postMessage('IT\'S ALIVE!!!!!!!')
    }
  }
}
