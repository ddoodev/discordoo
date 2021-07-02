import { Client, GatewayProvider } from '@src/core'
import { GatewayConnectOptions } from '@src/core/providers/gateway/options/GatewayConnectOptions'
import { PartialGatewayOptions } from '@src/gateway/interfaces/PartialGatewayOptions'
import { WebSocketManager } from '@src/gateway/WebSocketManager'

export class DefaultGatewayProvider implements GatewayProvider {
  public manager: WebSocketManager
  public client: Client
  public options: PartialGatewayOptions

  constructor(client: Client, options: PartialGatewayOptions) {
    this.client = client
    this.options = options

    this.manager = new WebSocketManager(options)
  }

  connect(options?: GatewayConnectOptions): Promise<unknown> {
    return this.manager.connect(options)
  }

  async disconnect(): Promise<unknown> {
    return this.manager.destroy()
  }
}
