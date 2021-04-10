/**
 * Represents a cache namespace. Custom caching modules must implement it
 * @note Some implementations may use remote cache, e.g. Redis, so all the methods are async
 */
export default interface CacheNamespace<K = unknown, V = unknown> {
  get(key: K): Promise<V | null>
  set(key: K, value: V): Promise<boolean>
  delete(key: K): Promise<boolean>
  has(key: K): Promise<boolean>
  size(): Promise<number>
}
