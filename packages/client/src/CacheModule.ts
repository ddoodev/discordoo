import CoreModule from './CoreModule'

/**
 * Represents a single cache module
 *
 * @template T - cache types
 */
export default interface CacheModule extends CoreModule {
  createCache<K>(type: string): K
  getCache<K>(type: string): K
}