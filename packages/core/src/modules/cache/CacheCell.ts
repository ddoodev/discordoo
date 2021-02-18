/**
 * A DTO cache cell. The thing, that is used by end-user
 */
import { Collection } from '@discordoo/collection'

export default interface CacheCell<K, V> {
  get: (key: K) => Promise<V | undefined>
  set: (key: K, value: V) => Promise<CacheCell<K, V>>
  delete: (key: K) => Promise<boolean>
  has: (key: K) => Promise<boolean>
  filter: (filter: (value: V, key: K, cell: CacheCell<K, V>) => boolean) => Promise<Collection<K, V>>
  random: (amount?: number) => Promise<V | V[]>
  destroy: () => Promise<void>
  size: () => Promise<number>
}