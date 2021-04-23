import { TypedEmitter } from 'tiny-typed-emitter'
import WSClientEvents from '@src/ws/WSClientEvents'
import GatewayOptions from '@src/ws/GatewayOptions'
import os from 'os'
import WebSocket from 'ws'
import { GatewayIdentifyData, RESTGetAPIGatewayBotResult } from 'discord-api-types'
import getGateway from '@src/util/getGateway'
import range from '../util/range'
import WSShard from './WSShard'

export default class WSClient extends TypedEmitter<WSClientEvents> {
  private options: GatewayOptions
  private connections: ws.Connection[] = []
  private gateway?: RESTGetAPIGatewayBotResult

  constructor(token: string, options: Omit<GatewayOptions, 'token'>) {
    super()
    this.options = Object.assign({
      token,
      properties: {
        $browser: 'Discordoo',
        $device: 'Discordoo',
        $os: os.arch()
      },
      version: 8,
      url: 'wss://gateway.discord.gg',
      compress: false,
      encoding: 'json',
      intents: 32509 // use all intents except privileged
    } as GatewayOptions, options)
  }

  /** Initiate connection to the gateway */
  async connect() {
    this.gateway = await getGateway(this.options.token)
    if (this.gateway.session_start_limit.remaining < this.totalShards!) throw new Error(
      `Connection limit is exceeded, reset in ${
        (this.gateway.session_start_limit.reset_after / 60000).toFixed(2)
      }min`
    )

  }

  /** Creates a WS connection to the Discord gateway */
  private createShard(id: number): WSShard {
    const connection = new WebSocket(this.options.url + `?v=${this.options.version}`)
  }

  /** The server connection will be sent to */
  private get connectionUrl() {
    return `${this.options.url}?v=${this.options.version}&encoding=${this.options.encoding}`
  }

  /**
   * Get a ratelimit key for a shard
   * @param id - ID of shard to get ratelimit key for
   */
  private getRatelimitKey(id: number) {
    return id % this.gateway!.session_start_limit.max_concurrency
  }

  /** Get total amount of shards to be spawned */
  private get totalShards(): number | undefined {
    if (this.options.shards === 'auto') return this.gateway?.shards
    else if (typeof this.options.shards === 'number') return this.options.shards
    else if (Array.isArray(this.options.shards)) return this.options.maxShards
    else throw new Error(
      'Unknown internal Discordoo error! It might have happened because you\'ve provided wrong configuration'
    )
  }

  /** Shard IDs to be spawned */
  private get shardIDs(): number[] {
    if (this.options.shards === 'auto') return range(this.gateway!.shards! - 1)
    else if (typeof this.options.shards === 'number') return range(this.options.shards - 1)
    else if (Array.isArray(this.options.shards)) return this.options.shards
    else throw new Error(
      'Unknown internal Discordoo error! It might have happened because you\'ve provided wrong configuration'
    )
  }

  /** Get identify data for a shard */
  private getIdentifyData(id: number): GatewayIdentifyData {
    return {
      token: this.options.token,
      properties: this.options.properties,
      intents: this.options.intents,
      large_threshold: this.options.large_threshold,
      compress: this.options.compress,
      presence: this.options.presence,
      shard: [ id, this.totalShards! ]
    }
  }
}
