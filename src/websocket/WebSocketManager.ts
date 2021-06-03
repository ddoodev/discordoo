import { TypedEmitter } from 'tiny-typed-emitter'
import WebSocketManagerEvents from '@src/websocket/WebSocketManagerEvents'
import GatewayOptions from '@src/websocket/GatewayOptions'
import { RESTGetAPIGatewayBotResult } from 'discord-api-types'
import getGateway from '@src/util/getGateway'
import WebSocketShard from '@src/websocket/WebSocketShard'
import { Collection } from '@src/collection'
import { promisify } from 'util'
import WebSocketUtils from '@src/util/WebSocketUtils'
import DiscordooError from '@src/util/DiscordooError'
import Optional from '@src/util/Optional'
import { Constants } from '@src/core'

const wait = promisify(setTimeout)

export default class WebSocketManager extends TypedEmitter<WebSocketManagerEvents> {
  public readonly options: GatewayOptions
  private gateway?: RESTGetAPIGatewayBotResult

  private shardQueue = new Set<WebSocketShard>()

  public totalShards = 1
  public shards = new Collection<number, WebSocketShard>()

  constructor(options: Optional<GatewayOptions, 'intents' | 'properties'>) {
    super()

    this.options = Object.assign(Constants.DEFAULT_WS_OPTIONS, options)
  }

  public async connect() {
    console.log('connecting')
    this.gateway = await getGateway(this.options.token).catch(e => {
      throw e.statusCode === 401 ? new Error('Discordoo: invalid token provided') : e
    })

    console.log('gateway:', this.gateway)
    const { shards: recommendedShards, url: gatewayUrl, session_start_limit: sessionStartLimit } = this.gateway

    this.options.url = gatewayUrl + '/' + '?encoding=' + WebSocketUtils.encoding + '&v=' + (this.options.version || 9)

    let { shards } = this.options

    // shards option processing
    switch (typeof shards) {
      case 'number': {
        this.totalShards = shards

        shards = Array.from({ length: shards }, (_, i) => i)
      } break

      case 'object':
        if (!Array.isArray(shards))
          throw new DiscordooError(
            'WebSocketManager',
            'invalid "shards" option:',
            'type of "shards" cannot be object'
          )
        else
          this.totalShards = shards.length
        break

      case 'string':
        if (shards === 'auto') {
          this.totalShards = recommendedShards

          shards = Array.from({ length: recommendedShards }, (_, i) => i)
        } else if (!isNaN(parseInt(shards))) {
          shards = parseInt(shards)

          this.totalShards = shards
          shards = Array.from({ length: shards }, (_, i) => i)
        } else {
          throw new DiscordooError(
            'WebSocketManager',
            'invalid "shards" option:',
            'if type of "shards" is string, it cannot be anything other than "auto"'
          )
        }
        break

      default:
        throw new DiscordooError(
          'WebSocketManager',
          'invalid "shards" option:',
          'received disallowed type:',
          typeof shards
        )
    }

    console.log('shards:', shards)

    console.log(this.totalShards)

    this.shardQueue = new Set(shards.map(id => new WebSocketShard(this, id)))
    console.log('queue:', this.shardQueue)

    if (sessionStartLimit.remaining < this.totalShards) {
      throw new DiscordooError(
        'WebSocketManager',
        'cannot start shards',
        Array.from(this.shardQueue).map(s => s.id).join(', '),
        'because the remaining number of session starts the current user is allowed is',
        sessionStartLimit.remaining,
        'but needed',
        this.totalShards + '.'
      )
    }

    return this.createShards()
  }

  private async createShards() {
    if (!this.shardQueue.size || this.shards.size >= (this.options.maxShards || Infinity)) return false

    const [ shard ] = this.shardQueue

    this.shardQueue.delete(shard)

    try {
      console.log('shard', shard.id, 'connecting')
      await shard.connect()
    } catch (e) {
      console.error(e)
    }

    this.shards.set(shard.id, shard)

    if (this.shardQueue.size) {
      // https://discord.com/developers/docs/topics/gateway#session-start-limit-object
      const delay = this.options.spawnDelay
        || 5000 / (this.gateway?.session_start_limit.max_concurrency || 1)

      await wait(delay)

      return this.createShards()
    }

    return true
  }
}
