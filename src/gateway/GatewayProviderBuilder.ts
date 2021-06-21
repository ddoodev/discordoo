import GatewayProvider from '@src/core/providers/gateway/GatewayProvider'
import PartialGatewayOptions from '@src/gateway/interfaces/PartialGatewayOptions'
import { Client } from '@src/core'
import WSProvider from '@src/gateway/WSProvider'

export default class GatewayProviderBuilder {
  public options: PartialGatewayOptions | undefined

  constructor(options?: PartialGatewayOptions) {
    this.options = options
  }

  getGatewayProvider(): (client: Client) => GatewayProvider {
    return (client: Client) => {
      const provider = new WSProvider({ ...this.options, token: client.token })
      return function () {
        return provider
      }
    }
  }
}
