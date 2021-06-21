import {GatewayProviderAPI, GatewayProviderEvents} from '@src/core'
import {TypedEmitter} from 'tiny-typed-emitter'
import GatewayOptions from '@src/gateway/interfaces/GatewayOptions'
import WebSocketManager from '@src/gateway/WebSocketManager'

export default class WSProvider extends TypedEmitter<GatewayProviderEvents> implements GatewayProviderAPI {
  manager: WebSocketManager
  constructor(public options: GatewayOptions) {
    super()
    this.manager = new WebSocketManager(options)
  }

  async connect(): Promise<void> {
    await this.manager.connect()
  }

  async disconnect(): Promise<void> {}
}
