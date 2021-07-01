import { CacheProvider, Client, DefaultClientStack, GatewayProvider, RESTProvider } from '@src/core'
import { ClientOptions } from '@src/core/client/ClientOptions'
import { CacheProviderConstructor } from '@src/core/providers/cache/CacheProviderConstructor'

export class ClientBuilder<Stack extends DefaultClientStack = DefaultClientStack> {
  public client: Client<Stack>

  constructor(token: string, options?: ClientOptions) {
    this.client = new Client<Stack>(token, options)
  }

  rest(provider: (client: Client) => RESTProvider): ClientBuilder<Stack> {
    this.client.useRESTProvider(provider)
    return this
  }

  cache(provider: CacheProviderConstructor<Stack['cache']>, ...options: any[]): ClientBuilder<Stack> {
    this.client.useCacheProvider(provider, ...options)
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
