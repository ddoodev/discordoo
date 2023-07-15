import { Collection } from '@discordoo/collection'
import { WebSocketClient } from '@src/gateway/WebSocketClient'
import { WebSocketClientEvents, WebSocketClientStates, WebSocketCloseCodes, WebSocketManagerStates } from '@src/constants'
import { DiscordooError } from '@src/utils'
import { GatewayProvider, GatewayShardsInfo } from '@discordoo/providers'
import { CompletedGatewayOptions } from '@src/gateway/interfaces/GatewayOptions'
import { inspect } from 'util'
import { makeConnectionUrl } from '@src/gateway/makeConnectionUrl'

export class WebSocketManager {
  public readonly options: CompletedGatewayOptions

  public provider: GatewayProvider
  public status: WebSocketManagerStates
  public shards = new Collection<number, WebSocketClient>()

  private queueInterval?: ReturnType<typeof setInterval>
  private shardQueue = new Set<WebSocketClient>()

  constructor(provider: GatewayProvider, options: CompletedGatewayOptions) {
    this.options = options
    this.status = WebSocketManagerStates.Created
    this.provider = provider
  }

  async connect(options?: GatewayShardsInfo) {
    // console.log('connecting')
    this.status = WebSocketManagerStates.Connecting

    if (options) {
      if (options.shards && options.totalShards) {
        this.options.sharding.shards = options.shards
        this.options.sharding.totalShards = options.totalShards
      }
    }

    // console.log('ws manager options:', options)
    // console.log('shards:', this.options.sharding.shards)
    // console.log('totalShards:', this.options.sharding.totalShards)

    this.shardQueue = new Set(this.options.sharding.shards.map(id => new WebSocketClient(this, id)))
    // console.log('queue:', this.shardQueue)

    if (!this.queueInterval) {
      this.queueInterval = setInterval(() => {
        if (this.shardQueue.size && this.status !== WebSocketManagerStates.Connecting) {
          this.createShards()
        }
      }, 1000)
    }

    const gateway = await this.provider.getGateway()

    const { compress, encoding, version } = this.options.connection

    this.options.connection.url = makeConnectionUrl({ url: gateway.url, encoding, compress, version })

    return this.createShards()
  }

  destroy() {
    this.status = WebSocketManagerStates.Disconnected
    this.shards.forEach(shard => shard.destroy({ reconnect: false, code: 1000 }))
    if (this.queueInterval) {
      clearInterval(this.queueInterval)
      this.queueInterval = undefined
      this.shards = new Collection()
      this.shardQueue = new Set()
    }
  }

  disconnect(shards?: number[]) {
    if (Array.isArray(shards)) {
      shards!.forEach(id => this.shards.get(id)?.destroy({ reconnect: false, code: 1000 }))
    } else {
      this.shards.forEach(shard => shard.destroy({ reconnect: false, code: 1000 }))
    }

    if (this.shards.every(shard => shard.status === WebSocketClientStates.Disconnected)) {
      this.status = WebSocketManagerStates.Disconnected
    }
  }

  private async createShards() {
    if (!this.shardQueue.size) return false
    this.status = WebSocketManagerStates.Connecting

    const [ shard ] = this.shardQueue

    this.shardQueue.delete(shard)

    if (!shard.listeners(WebSocketClientEvents.ReconnectMe).length) {
      shard.on(WebSocketClientEvents.ReconnectMe, () => {
        this.shardQueue.add(shard)
      })
    }

    try {
      await shard.connect()
    } catch (e: any) {
      if (e?.code) {
        switch (e.code) {
          case WebSocketCloseCodes.DisallowedIntents:
          case WebSocketCloseCodes.InvalidIntents:
          case WebSocketCloseCodes.InvalidApiVersion:
          case WebSocketCloseCodes.InvalidShard:
          case WebSocketCloseCodes.AuthenticationFailed:
          case WebSocketCloseCodes.ShardingRequired:
            throw new DiscordooError(
              'WebSocketManager',
              'Shard', shard.id,
              'can not be connected because it received close code',
              e.code, 'with reason',
              e.reason ?? 'Unknown error'
            )

          case 1000:
          case WebSocketCloseCodes.AlreadyAuthenticated:
          case WebSocketCloseCodes.InvalidSequence:
            // TODO: debug...
            shard.destroy({ reconnect: false })
            shard.emit(WebSocketClientEvents.ReconnectMe, true)
            break

          default:
            // TODO: debug...
            shard.emit(WebSocketClientEvents.ReconnectMe)
        }
      } else {
        throw new DiscordooError(
          'WebSocketManager',
          'Shard', shard.id, 'cannot connect to the gateway.',
          `Error name: ${e?.name ?? 'Unknown'}; Error message: ${e?.message ?? 'Unknown Error'};`,
          (!e?.name && !e?.message) ? `Error body: ${inspect(e, { depth: 2 })}` : ''
        )
      }
    }

    this.shards.set(shard.id, shard)

    if (this.shardQueue.size) {
      const [ next ] = this.shardQueue
      await this.provider.waitShardSpawnTurn(next.id)

      return this.createShards()
    } else {
      this.status = WebSocketManagerStates.Ready
    }

    return true
  }
}
