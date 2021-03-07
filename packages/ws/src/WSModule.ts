import { Client, GatewayModule, ModuleInitContext } from '@discordoo/core'
import WSConfig from './WSConfig'
import WebSocketManager from './WebSocketManager'

export default class WSModule implements GatewayModule {
  config: WSConfig
  id = 'discordoo.modules.websocket'
  isCore = true
  shards: WebSocketManager = new WebSocketManager(this)
  type: 'gateway' | 'rest' | 'cache' = 'gateway'
  client?: Client

  constructor(config: WSConfig = {}) {
    this.config = config
  }

  async init(ctx: ModuleInitContext) {
    this.client = ctx.client
    console.log(this.client)
    await this.shards.startShards(this.config?.file as string)
  }

  get token(): string | undefined {
    return this.client?.config.token
  }

  get totalShards() {
    if (Array.isArray(this.config.shards)) {
      return this.config.shards.length
    } else {
      return this.config.shards
    }
  }
}
