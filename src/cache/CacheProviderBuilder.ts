import { CacheProvider, Client } from '@src/core'
import CacheManager from '@src/cache/CacheManager'

/** An adapter of {@link CacheManager} for {@link Client} */
export default class CacheProviderBuilder {
  /** Cache manager, adapted by this adapter */
  manager: CacheManager = new CacheManager

  /** Get a cache provider */
  getCacheProvider(): (client: Client) => CacheProvider {
    const manager = this.manager // this.manager is shadowed in nested function

    return (client: Client) => function (id: string) {
      return manager.getCache(id)
    }
  }
}