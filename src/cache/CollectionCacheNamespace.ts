import CacheNamespace from '@src/core/providers/cache/CacheNamespace'
import { Collection } from '@src/collection'

/** Represents a cache namespace */
export default class CollectionCacheNamespace<K = unknown, V = unknown> implements CacheNamespace<K, V> {
  /** Collection used by this cache namespace */
  #data: Collection<K, V> = new Collection<K, V>()

  /**
   * Delete a key from collection
   * @param key - key to delete
   */
  async delete(key: K): Promise<boolean> {
    return this.#data.delete(key)
  }

  /**
   * Get a key from collection
   * @param key - key to get
   */
  async get(key: K): Promise<V | null> {
    return this.#data.get(key) ?? null
  }

  /**
   * Check if collection has a key
   * @param key - ket to check
   */
  async has(key: K): Promise<boolean> {
    return this.#data.has(key)
  }

  /**
   * Change key's value
   * @param key - key to set
   * @param value - value to set
   */
  async set(key: K, value: V): Promise<boolean> {
    this.#data.set(key, value)
    return true
  }

  /** Get total elements in the collection */
  async size(): Promise<number> {
    return this.#data.size
  }

  /** The same as {@link Collection#filter} */
  async filter(predicate: (value: V, key: K, collection: Collection<K, V>) => boolean): Promise<Collection<K, V>> {
    return this.#data.filter(predicate)
  }

  /** The same as {@link Collection#random} */
  async random(amount?: number): Promise<V | V[]> {
    return this.#data.random(amount)
  }

  /** The same as {@link Collection#forEach} */
  async forEach(predicate: (value: V, key: K, collection: Collection<K, V>) => boolean) {
    return this.#data.forEach(predicate)
  }
}
