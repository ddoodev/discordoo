import { Collection } from '@src/collection'
import CollectionCacheNamespace from '@src/cache/CollectionCacheNamespace'

/**
 * Represents a cache manager
 *
 * Used for cache namespaces fetching
 * */
export default class CacheManager {
  /** Namespaces controlled by this manager */
  caches: Collection<string, CollectionCacheNamespace> = new Collection()

  /**
   * Get a cache namespace
   * @param id - id of cache namespace
   * @param local - whether to use IPC when a key is not found
   */
  getCache<K = unknown, V = unknown>(id: string, local = true): CollectionCacheNamespace<K, V> {
    if (this.caches.has(id)) return (this.caches.get(id)!) as CollectionCacheNamespace<K, V>
    else {
      this.caches.set(id, new CollectionCacheNamespace())
      return (this.caches.get(id)!) as CollectionCacheNamespace<K, V>
    }
  }
}
