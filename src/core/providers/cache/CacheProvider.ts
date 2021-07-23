import { Provider } from '@src/core/providers/Provider'

/**
 * Represents a cache provider. Custom caching providers must implement it
 *
 * Node: Some implementations may use remote cache, e.g. Redis, so all the methods are async
 */
export interface CacheProvider extends Provider {
  /**
   * All cache providers must has this property,
   * which indicates whether the provider can cache regular javascript classes.
   *
   * When `true`, the library will pass regular javascript classes to the cache.
   *
   * When `false`, the library will translate javascript classes into JSON and pass JSON to the cache.
   * */
  classesCompatible: boolean

  /**
   * All cache providers must has this property,
   * which indicates whether the provider uses shared cache between several shards.
   *
   * When `true`, the library will not request the cache from neighboring shards,
   * but will immediately request the cache from the provider. Example:
   *
   * developer wants check if X emoji exists in the cache on all shards --> library sends request to cache provider -->
   * cache provider replies --> library replies to developer
   *
   * When `false`, the library will try to find the cache on the shards specified by the developer. Example:
   *
   * developer wants check if X emoji exists in the cache on all shards --> library sends request to sharding manager -->
   * sharding manager sends request to all shards --> shards request cache from local cache providers -->
   * shards are replying --> sharding manager serializes replies -->
   * sharding manager sends reply to the shard from which the request came --> library replies to developer
   * */
  sharedCache: boolean

  /**
   * Get value from key
   * @param keyspace - keyspace in which to search
   * @param key - key to get value
   */
  get<K = string, V = any>(keyspace: string, key: K): Promise<V | undefined>

  /**
   * Set a key to given value
   * @param keyspace - keyspace in which to set
   * @param key - key to use
   * @param value - value to set
   */
  set<K = string, V = any>(keyspace: string, key: K, value: V): Promise<CacheProvider>

  /**
   * Delete a key from cache
   * @param keyspace - keyspace in which to delete
   * @param key - key(s) of cache to delete
   */
  delete<K = string>(keyspace: string, key: K | K[]): Promise<boolean>

  /**
   * Execute a provided function once for each cache element
   * @param keyspace - keyspace in which to execute
   * @param predicate - function to execute
   * */
  forEach<K = string, V = any>(
    keyspace: string, predicate: (value: V, key: K, provider: CacheProvider) => unknown
  ): Promise<void>

  /**
   * Get size of cache in keyspace or in all cache
   * @param keyspace - keyspace in which to search
   * */
  size?(keyspace: string): Promise<number>

  /**
   * Check if key exists in cache
   * @param keyspace - keyspace in which to search
   * @param key - key to check
   */
  has?<K = string>(keyspace: string, key: K): Promise<boolean>

  /**
   * Execute a provided function once for each cache element and then delete the elements that the function returned true for
   * @param keyspace - keyspace in which to execute
   * @param predicate - function to execute
   * */
  sweep?<K = string, V = any>(
    keyspace: string, predicate: (value: V, key: K, provider: CacheProvider) => boolean
  ): Promise<void>

  /**
   * Execute a provided function once for each cache element and then make array of elements that the function returned true for
   * @param keyspace - keyspace in which to execute
   * @param predicate - function to execute
   * */
  filter?<K = string, V = any>(
    keyspace: string, predicate: (value: V, key: K, provider: CacheProvider) => boolean
  ): Promise<Array<[ K, V ]>>

  /**
   * Creates a new array populated with the results of calling a provided function on every cache element
   * @param keyspace - keyspace in which to execute
   * @param predicate - function to execute
   * */
  map?<K = string, V = any, R = any>(
    keyspace: string, predicate: (value: V, key: K, provider: CacheProvider) => R
  ): Promise<R[]>

  /**
   * Execute a provided function once for each cache element and return element that the function returned true for
   * @param keyspace - keyspace in which to execute
   * @param predicate - function to execute
   * */
  find?<K = string, V = any>(
    keyspace: string, predicate: (value: V, key: K, provider: CacheProvider) => boolean
  ): Promise<V | undefined>

}
