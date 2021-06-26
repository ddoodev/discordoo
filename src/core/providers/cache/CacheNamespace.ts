/**
 * Represents a cache namespace. Custom caching modules must implement it
 * @note Some implementations may use remote cache, e.g. Redis, so all the methods are async
 */
export interface CacheNamespace<K = unknown, V = unknown> {
  /**
   * Get value from key
   * @param key - key to get
   */
  get(key: K): Promise<V | null>

  /**
   * Set a key to given value
   * @param key - key to set
   * @param value - value to be set
   */
  set(key: K, value: V): Promise<boolean>

  /**
   * Delete a key from cache
   * @param key - cache to delete
   */
  delete(key: K): Promise<boolean>

  /**
   * Check if key exists in cache
   * @param key - key to check
   */
  has(key: K): Promise<boolean>

  /** Get size of cache */
  size(): Promise<number>
}
