import { CacheProvider, Client, DefaultClientStack, GatewayProvider, RESTProvider } from '@src/core'
import ClientOptions from '@src/core/client/ClientOptions'

export default class ClientBuilder<Stack extends DefaultClientStack = DefaultClientStack> {
  public client: Client<Stack>

  constructor(token: string, options?: ClientOptions) {
    this.client = new Client<Stack>(token, options)
  }

  rest(provider: (client: Client) => RESTProvider): ClientBuilder<Stack> {
    this.client.useRESTProvider(provider)
    return this
  }

  cache(provider: (client: Client) => CacheProvider): ClientBuilder<Stack> {
    this.client.useCacheProvider(provider)
    return this
  }

  gateway(provider: (client: Client) => GatewayProvider): ClientBuilder<Stack> {
    this.client.useGatewayProvider(provider)
    return this
  }

  build() {
    return this.client
  }
}
