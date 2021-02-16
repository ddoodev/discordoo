import CoreModule from './CoreModule'

/**
 * Represents a single cache module
 *
 * @template T - cache types
 */
export default interface CacheModule extends CoreModule {
  type: 'cache'
  createCache<K>(type: string): K
  getCache<K>(type: string): K
}