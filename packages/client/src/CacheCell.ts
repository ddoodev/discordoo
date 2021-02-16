/**
 * A DAO cache cell. The thing, that is used by end-user
 */
import CacheModule from "./CacheModule";

export default interface CacheCell<K, V> {
  get: (key: K) => Promise<V>
  set: (key: K, value: V) => Promise<V>
  delete: (key: K) => Promise<void>
  has: (key: K) => Promise<boolean>
  filter: (filter: (value: V, key: K, index: number) => void) => Promise<CacheCell<K, V>>
  random: (amount?: number) => typeof amount extends number ? Promise<V[]> : Promise<V>
  module: CacheModule<any>
}