import { CacheProvider, Client } from '@src/core'
import CacheManager from '@src/cache/CacheManager'

export default class CacheProviderBuilder {
  manager: CacheManager = new CacheManager

  getCacheProvider(): (client: Client) => CacheProvider {
    const manager = this.manager // this.manager is shadowed in nested function

    return (client: Client) => function (id: string) {
      return manager.getCache(id)
    }
  }
}