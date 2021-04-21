import { TypedEmitter } from 'tiny-typed-emitter'
import WSClientEvents from '@src/ws/WSClientEvents'
import GatewayOptions from '@src/ws/GatewayOptions'
import os from 'os'
import * as ws from 'ws'
import { RESTGetAPIGatewayBotResult } from 'discord-api-types'
import getGateway from '@src/util/getGateway'

export default class WSClient extends TypedEmitter<WSClientEvents> {
  private options: GatewayOptions
  private connections: ws.Connection[] = []
  private gateway?: RESTGetAPIGatewayBotResult

  constructor(token: string, options: Omit<GatewayOptions, 'token'>) {
    super()
    this.options = Object.assign({
      token,
      properties: {
        browser: 'Discordoo',
        device: 'Discordoo',
        os: os.arch()
      },
      intents: 32509
    }, options)
  }

  async connect() {
    this.gateway = await getGateway(this.options.token)
  }

  get totalShards(): number | undefined {
    if (this.options.shards === 'auto') return this.gateway?.shards
    else if (typeof this.options.shards === 'number') return this.options.shards
    else if (Array.isArray(this.options.shards)) return this.options.maxShards
    else throw new Error(
      'Unknown internal Discordoo error! It might have happened because you\'ve provided wrong configuration'
    )
  }
}
