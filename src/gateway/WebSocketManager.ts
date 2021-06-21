import { TypedEmitter } from 'tiny-typed-emitter'
import { Collection } from '@src/collection'
import { Constants } from '@src/core'
import { RESTGetAPIGatewayBotResult } from 'discord-api-types'
import WebSocketManagerEvents from '@src/gateway/interfaces/WebSocketManagerEvents'
import GatewayOptions from '@src/gateway/interfaces/GatewayOptions'
import Optional from '@src/utils/Optional'
import WebSocketClient from '@src/gateway/WebSocketClient'
import wait from '@src/utils/wait'
import { WebSocketClientEvents, WebSocketManagerStates } from '@src/core/Constants'
import inspectWsOptions from '@src/gateway/wsmanager/inspectWsOptions'

export default class WebSocketManager extends TypedEmitter<WebSocketManagerEvents> {
  public readonly options: GatewayOptions
  private gateway?: RESTGetAPIGatewayBotResult
  private status: WebSocketManagerStates
  private queueInterval?: NodeJS.Timeout

  private shardQueue = new Set<WebSocketClient>()

  public totalShards = 1
  public shards = new Collection<number, WebSocketClient>()

  constructor(options: Optional<GatewayOptions, 'intents' | 'properties'>) {
    super()

    this.options = Object.assign(Constants.DEFAULT_WS_OPTIONS, options)
    this.status = WebSocketManagerStates.CREATED
  }

  public async connect() {
    console.log('connecting')
    this.status = WebSocketManagerStates.CONNECTING

    const { url, shardsInTotal, shardsToSpawn: shards, gateway } = await inspectWsOptions(this.options)

    this.options.url = url
    this.totalShards = shardsInTotal
    this.gateway = gateway

    console.log('shards:', shards)
    console.log('totalShards:', this.totalShards)

    this.shardQueue = new Set(shards.map(id => new WebSocketClient(this, id)))
    console.log('queue:', this.shardQueue)

    if (!this.queueInterval) {
      this.queueInterval = setInterval(() => {
        if (this.shardQueue.size && this.status !== WebSocketManagerStates.CONNECTING) {
          this.createShards()
        }
      }, 1000)
    }

    return this.createShards()
  }

  public destroy() {
    this.status = WebSocketManagerStates.DISCONNECTED
    this.shards.forEach(shard => shard.destroy({ reconnect: false }))
  }

  private async createShards() {
    if (!this.shardQueue.size || this.shards.size >= (this.options.maxShards || Infinity)) return false
    this.status = WebSocketManagerStates.CONNECTING

    const [ shard ] = this.shardQueue

    this.shardQueue.delete(shard)

    try {
      console.log('shard', shard.id, 'connecting')
      await shard.connect().catch(() => shard.emit(WebSocketClientEvents.RECONNECT_ME))
    } catch (e) {
      console.error(e)
    }

    this.shards.set(shard.id, shard)

    if (!shard.listeners(WebSocketClientEvents.RECONNECT_ME).length) {
      shard.on(WebSocketClientEvents.RECONNECT_ME, () => {
        this.shardQueue.add(shard)
      })
    }

    if (this.shardQueue.size) {
      // https://discord.com/developers/docs/topics/gateway#session-start-limit-object
      const delay = (this.options.spawnDelay || 5000) / (this.gateway?.session_start_limit.max_concurrency || 1)

      await wait(delay)

      return this.createShards()
    } else {
      this.status = WebSocketManagerStates.READY
    }

    return true
  }
}
