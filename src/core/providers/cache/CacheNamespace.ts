/** Represents a cache namespace. Custom caching modules must implements it */
export default interface CacheNamespace<K = unknown, V = unknown> {
  get(key: K): Promise<V>
  set(key: K, value: V): Promise<boolean>
  delete(key: K): Promise<boolean>
  has(key: K): Promise<boolean>
}
