import { TypedEmitter } from 'tiny-typed-emitter'
import WebSocketManagerEvents from '@src/websocket/WebSocketManagerEvents'
import GatewayOptions from '@src/websocket/GatewayOptions'
import { RESTGetAPIGatewayBotResult } from 'discord-api-types'
import getGateway from '@src/util/getGateway'
import WebSocketShard from '@src/websocket/WebSocketShard'
import { Collection } from '@src/collection'
import { promisify } from 'util'
import WebSocketUtils from '@src/util/WebSocketUtils'

const wait = promisify(setTimeout)

// a few notes:
// * this.options cannot be sent to the gateway, it shall be sieved
// * WebSocketManager spawns shards and collects events from them. It doesn't
// spawn new threads or stuff like that
// * this.gateway is the result of getGateway() util
//
// Have fun!
export default class WebSocketManager extends TypedEmitter<WebSocketManagerEvents> {
  public readonly options: GatewayOptions
  private gateway?: RESTGetAPIGatewayBotResult

  private shardQueue = new Set<WebSocketShard>()

  public totalShards = 1
  public shards = new Collection<number, WebSocketShard>()

  constructor(token: string, options: Omit<GatewayOptions, 'token'>) {
    super()

    this.options = Object.assign({
      token: token,
      properties: {
        $browser: 'Discordoo',
        $device: 'Discordoo',
        $os: process.platform
      },
      version: 9,
      url: 'wss://gateway.discord.gg',
      compress: false,
      encoding: 'json',
      shards: 'auto',
      intents: 32509 // use all intents except privileged
    }, options)
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
        if (!Array.isArray(shards)) throw new Error('Discordoo: WebSocketManager: type of "shards" cannot be object')
        else this.totalShards = shards.length
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
          throw new Error('Discordoo: WebSocketManager: invalid "shards" option: ' +
            'if type of "shards" is string, it cannot be anything other than "auto"')
        }
        break

      default:
        throw new Error(
          'Discordoo: WebSocketManager: invalid "shards" option: received disallowed type: ' + typeof shards
        )
    }

    console.log('shards:', shards)

    this.shardQueue = new Set(shards.map(id => new WebSocketShard(this, id)))
    console.log('queue:', this.shardQueue)
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
      const delay = this.options.spawnDelay || 5000

      await wait(delay)
      return this.createShards()
    }

    return true
  }
}
