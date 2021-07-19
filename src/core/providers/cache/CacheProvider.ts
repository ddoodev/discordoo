import { CacheProviderGetOptions } from '@src/core/providers/cache/options/CacheProviderGetOptions'
import { CacheProviderSetOptions } from '@src/core/providers/cache/options/CacheProviderSetOptions'
import { CacheProviderDeleteOptions } from '@src/core/providers/cache/options/CacheProviderDeleteOptions'
import { CacheProviderHasOptions } from '@src/core/providers/cache/options/CacheProviderHasOptions'
import { CacheProviderSizeOptions } from '@src/core/providers/cache/options/CacheProviderSizeOptions'
import { Provider } from '@src/core/providers/Provider'

/**
 * Represents a cache provider. Custom caching providers must implement it
 *
 * Node: Some implementations may use remote cache, e.g. Redis, so all the methods are async
 */
export interface CacheProvider extends Provider {

  /**
   * Get value from key
   * @param keyspace - keyspace in which to search
   * @param key - key to get value
   * @param options - getting options
   */
  get<K = string, V = any>(keyspace: string, key: K, options?: CacheProviderGetOptions): Promise<V | null>

  /**
   * Set a key to given value
   * @param keyspace - keyspace in which to set
   * @param key - key to use
   * @param value - value to set
   * @param options - setting options
   */
  set<K = string, V = any>(keyspace: string, key: K, value: V, options?: CacheProviderSetOptions): Promise<CacheProvider>

  /**
   * Delete a key from cache
   * @param keyspace - keyspace in which to delete
   * @param key - cache to delete
   * @param options - deleting options
   */
  delete<K = string>(keyspace: string, key: K, options?: CacheProviderDeleteOptions): Promise<boolean>

  /**
   * Check if key exists in cache
   * @param keyspace - keyspace in which to search
   * @param key - key to check
   * @param options - checking options
   */
  has<K = string>(keyspace: string, key: K, options?: CacheProviderHasOptions): Promise<boolean>

  /**
   * Get size of cache in keyspace or in all cache
   * @param keyspace - keyspace in which to search
   * @param options - calculating options
   * */
  size(keyspace?: string, options?: CacheProviderSizeOptions): Promise<number>

  // TODO: add forEach, sweep and filter methods
}
