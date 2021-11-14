import { Collection } from '@discordoo/collection'
import { WebSocketClient } from '@src/gateway/WebSocketClient'
import { WebSocketClientEvents, WebSocketClientStates, WebSocketManagerStates } from '@src/constants'
import { DiscordooError } from '@src/utils'
import { GatewayProvider, GatewayShardsInfo } from '@discordoo/providers'
import { CompletedGatewayOptions } from '@src/gateway/interfaces/CompletedGatewayOptions'

export class WebSocketManager {
  public readonly options: CompletedGatewayOptions

  public provider: GatewayProvider
  public status: WebSocketManagerStates
  public shards = new Collection<number, WebSocketClient>()

  private queueInterval?: ReturnType<typeof setInterval>
  private shardQueue = new Set<WebSocketClient>()

  constructor(provider: GatewayProvider, options: CompletedGatewayOptions) {
    this.options = options
    this.status = WebSocketManagerStates.CREATED
    this.provider = provider
  }

  async connect(options?: GatewayShardsInfo) {
    // console.log('connecting')
    this.status = WebSocketManagerStates.CONNECTING

    if (options) {
      if (options.shards && options.totalShards) {
        this.options.shards = options.shards
        this.options.totalShards = options.totalShards
      }
    }

    // console.log('ws manager options:', options)
    // console.log('shards:', this.options.shards)
    // console.log('totalShards:', this.options.totalShards)

    this.shardQueue = new Set(this.options.shards.map(id => new WebSocketClient(this, id)))
    // console.log('queue:', this.shardQueue)

    if (!this.queueInterval) {
      this.queueInterval = setInterval(() => {
        if (this.shardQueue.size && this.status !== WebSocketManagerStates.CONNECTING) {
          this.createShards()
        }
      }, 1000)
    }

    const gateway = await this.provider.getGateway()

    this.options.url =
      gateway.url + '/?v='
      + this.options.version + '&encoding=' + this.options.encoding
      + (this.options.compress ? '&compress=zlib-stream' : '')

    // console.log('URL', this.options.url)

    return this.createShards()
  }

  destroy() {
    this.status = WebSocketManagerStates.DISCONNECTED
    this.shards.forEach(shard => shard.destroy({ reconnect: false }))
    if (this.queueInterval) {
      clearInterval(this.queueInterval)
      this.queueInterval = undefined
      this.shards = new Collection()
      this.shardQueue = new Set()
    }
  }

  disconnect(shards?: number[]) {
    switch (Array.isArray(shards)) {
      case true:
        shards!.forEach(id => this.shards.get(id)?.destroy({ reconnect: false }))
        break
      case false:
        this.shards.forEach(shard => shard.destroy({ reconnect: false }))
        break
    }

    if (this.shards.every(shard => shard.status === WebSocketClientStates.DISCONNECTED)) {
      this.status = WebSocketManagerStates.DISCONNECTED
    }
  }

  private async createShards() {
    if (!this.shardQueue.size) return false
    this.status = WebSocketManagerStates.CONNECTING

    const [ shard ] = this.shardQueue

    this.shardQueue.delete(shard)

    if (!shard.listeners(WebSocketClientEvents.RECONNECT_ME).length) {
      shard.on(WebSocketClientEvents.RECONNECT_ME, () => {
        this.shardQueue.add(shard)
      })
    }

    try {
      // console.log('shard', shard.id, 'connecting')
      await shard.connect()
        .catch(e => {
          if (e && !(e instanceof DiscordooError)) shard.emit(WebSocketClientEvents.RECONNECT_ME)
          // console.error(e)
        })
    } catch (e) {
      // console.error(e)
    }

    this.shards.set(shard.id, shard)

    if (this.shardQueue.size) {
      const [ next ] = this.shardQueue
      await this.provider.waitShardSpawnTurn(next.id)

      return this.createShards()
    } else {
      this.status = WebSocketManagerStates.READY
    }

    return true
  }
}
