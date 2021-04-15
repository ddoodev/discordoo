import { CacheProvider, Client, DefaultClientStack, RESTProvider } from '@src/core'
import { CacheProviderBuilder } from '@src/cache'
import { RESTProviderBuilder } from '@src/rest'
import ModuleHostModule from '@src/wrapper/ModuleHostModule'

export default class ClientBuilder<Stack extends DefaultClientStack = DefaultClientStack> {
  client: Client<Stack>

  constructor(token: string, root: ModuleHostModule) {
    this.client = new Client<Stack>(token)
    this.client.useCacheProvider(new CacheProviderBuilder().getCacheProvider())
    this.client.useRESTProvider(new RESTProviderBuilder().getRestProvider())
    this.client.use(root)
  }

  rest(provider: (client: Client) => RESTProvider): ClientBuilder<Stack> {
    this.client.useRESTProvider(provider)
    return this
  }

  cache(provider: (client: Client) => CacheProvider): ClientBuilder<Stack> {
    this.client.useCacheProvider(provider)
    return this
  }

  build() {
    return this.client
  }
}
