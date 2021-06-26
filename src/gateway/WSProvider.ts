import { GatewayProviderAPI, GatewayProviderEvents } from '@src/core'
import { TypedEmitter } from 'tiny-typed-emitter'
import { WebSocketManager } from '@src/gateway/WebSocketManager'
import PartialGatewayOptions from '@src/gateway/interfaces/PartialGatewayOptions'
import { GatewayConnectOptions } from '@src/gateway/interfaces/GatewayConnectOptions'

export class WSProvider extends TypedEmitter<GatewayProviderEvents> implements GatewayProviderAPI {
  manager: WebSocketManager

  constructor(public options: PartialGatewayOptions) {
    super()
    this.manager = new WebSocketManager(options)
  }

  async connect(options?: GatewayConnectOptions): Promise<void> {
    await this.manager.connect(options)
  }

  async disconnect(): Promise<void> {
    await this.manager.destroy()
  }
}
