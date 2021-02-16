import CoreModule from './CoreModule'

/**
 * Represents a single cache module
 *
 * @template T - cache types
 */
export default interface CacheModule<T> extends CoreModule {
  type: 'cache'
  createCache<K>(type: T): K
  getCache<K>(type: T): K
}