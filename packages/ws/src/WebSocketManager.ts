import {ShardLike, ShardsManager} from '@discordoo/core'
import WebSocket from 'ws'
import WSModule from './WSModule'
import { Collection } from '@discordoo/collection'
import WSShard from './WSShard'

export default class WebSocketManager implements ShardsManager<WebSocket> {
  module: WSModule
  shards: Collection<number, WSShard> = new Collection<number, WSShard>()

  get all(): ShardLike {
    return {} as ShardLike
  }

  constructor(module: WSModule) {
    this.module = module
  }

  get(id: number): WSShard | undefined {
    return this.shards.get(id)
  }
}
