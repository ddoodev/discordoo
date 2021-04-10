import { Collection } from '@src/collection'
import CollectionCacheNamespace from '@src/cache/CollectionCacheNamespace'

export default class CacheManager {
  caches: Collection<string, CollectionCacheNamespace> = new Collection

  getCache(id: string): CollectionCacheNamespace {
    if (this.caches.has(id)) return this.caches.get(id)!
    else {
      this.caches.set(id, new CollectionCacheNamespace())
      return this.caches.get(id)!
    }
  }
}