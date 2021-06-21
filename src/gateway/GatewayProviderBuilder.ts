import GatewayProvider from '@src/core/providers/gateway/GatewayProvider'
import PartialGatewayOptions from '@src/gateway/interfaces/PartialGatewayOptions'
import { Client } from '@src/core'

export default class GatewayProviderBuilder {
  public options: PartialGatewayOptions | undefined

  constructor(options?: PartialGatewayOptions) {
    this.options = options
  }

  getGatewayProvider(): (client: Client) => GatewayProvider {
    return 1 as unknown as (client: Client) => GatewayProvider
  }
}
