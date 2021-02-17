/**
 * A DAO cache cell. The thing, that is used by end-user
 */
import CacheModule from './CacheModule'

export default interface CacheCell<K, V> {
  get: (key: K) => Promise<V | undefined>
  set: (key: K, value: V) => Promise<Map<K, V>>
  delete: (key: K) => Promise<boolean>
  has: (key: K) => Promise<boolean>
  filter: (filter: (value: V, key: K, cell: CacheCell<K, V>) => boolean) => Promise<Map<K, V>>
  random: (amount?: number) => Promise<V | V[]>
  destroy: () => Promise<void>
  module: CacheModule
}