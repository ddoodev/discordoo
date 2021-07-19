import { Client, GatewayConnectOptions, GatewayProvider, ProviderConstructor } from '@src/core'
import { GatewayManagerOptions } from '@src/gateway/interfaces/GatewayManagerOptions'

export class GatewayManager<P extends GatewayProvider = GatewayProvider> {
  public client: Client
  public provider: P

  constructor(client: Client, provider: ProviderConstructor<P>, options: GatewayManagerOptions) {
    this.client = client
    this.provider = new provider(this.client, options.provider)
  }

  init() {
    return this.provider.init()
  }

  connect(options?: GatewayConnectOptions) {
    return this.provider.connect(options)
  }

  disconnect() {
    return this.provider.disconnect()
  }

}
