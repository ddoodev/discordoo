import { CacheProvider, Client, ProviderConstructor } from '@src/core'
import { CacheManagerOptions } from '@src/cache/interfaces/CacheManagerOptions'

export class CacheManager<P extends CacheProvider = CacheProvider> {
  public client: Client
  public provider: P

  constructor(client: Client, provider: ProviderConstructor<P>, options: CacheManagerOptions) {
    this.client = client
    this.provider = new provider(this.client, options.provider)
  }

  init() {
    return this.provider.init()
  }
}
