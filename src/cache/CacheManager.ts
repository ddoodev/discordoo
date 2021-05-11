import { Collection } from '@src/collection'
import CollectionCacheNamespace from '@src/cache/CollectionCacheNamespace'

/**
 * Represents a cache manager
 *
 * Used for cache namespaces fetching
 * */
export default class CacheManager {
  /** Namespaces controlled by this manager */
  caches: Collection<string, CollectionCacheNamespace> = new Collection

  /**
   * Get a cache namespace
   * @param id - id of cache namespace
   */
  getCache<K = unknown, V = unknown>(id: string): CollectionCacheNamespace<K, V> {
    if (this.caches.has(id)) return this.caches.get(id)!
    else {
      this.caches.set(id, new CollectionCacheNamespace())
      return this.caches.get(id)!
    }
  }
}
