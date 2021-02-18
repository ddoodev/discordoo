import CoreModule from '../CoreModule'
import CacheCell from './CacheCell'

/**
 * Represents a single cache module
 *
 * @template T - cache types
 */
export default interface CacheModule extends CoreModule {
  createCache<K extends CacheCell<any, any>>(type: string): K
  getCache<K extends CacheCell<any, any>>(type: string): K | undefined
}