import { Client, GatewayModule, GatewayModuleConfig, ModuleInitContext } from '@discordoo/core'
import WebSocket from 'ws'
import WebSocketManager from './WebSocketManager'

export default class WSModule implements GatewayModule<WebSocket> {
  config: GatewayModuleConfig
  id = 'discordoo.modules.websocket'
  isCore = true
  shards: WebSocketManager = new WebSocketManager(this)
  type: 'gateway' | 'rest' | 'cache' = 'gateway'
  client?: Client

  constructor(config: GatewayModuleConfig) {
    this.config = config
  }

  init(ctx: ModuleInitContext) {
    this.client = ctx.client
  }
}
