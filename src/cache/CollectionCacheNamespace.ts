import CacheNamespace from '@src/core/providers/cache/CacheNamespace'
import { Collection } from '@src/collection'

export default class CollectionCacheNamespace<K = unknown, V = unknown> implements CacheNamespace<K, V> {
  data: Collection<K, V> = new Collection<K, V>()

  async delete(key: K): Promise<boolean> {
    return this.data.delete(key)
  }

  async get(key: K): Promise<V | null> {
    return this.data.get(key) ?? null
  }

  async has(key: K): Promise<boolean> {
    return this.data.has(key)
  }

  async set(key: K, value: V): Promise<boolean> {
    this.data.set(key, value)
    return true
  }

  async size(): Promise<number> {
    return this.data.size
  }

  filter(predicate: (value: V, key: K, collection: Collection<K, V>) => boolean): Collection<K, V> {
    return this.data.filter(predicate)
  }

  random(amount?: number): V | V[] {
    return this.data.random(amount)
  }

  forEach(predicate: (value: V, key: K, collection: Collection<K, V>) => boolean) {
    return this.data.forEach(predicate)
  }
}