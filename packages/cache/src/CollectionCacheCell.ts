import { CacheCell } from '@discordoo/core'
import { Collection } from '@discordoo/collection'

export default class CollectionCacheCell<K, V> implements CacheCell<K, V> {
  private _data?: Collection<K, V> = new Collection<K, V>() // the other way tsc argues for some reason
  public type: string

  constructor(type: string) {
    this.type = type
  }

  async delete(key: K): Promise<boolean> {
    return this._data!.delete(key)
  }

  async filter(filter: (value: V, key: K, cell: CollectionCacheCell<K, V>) => boolean): Promise<Collection<K, V>> {
    filter = filter.bind(this)
    const results = new Collection<K, V>()

    this._data!.forEach(async (v, k) => {
      if (await filter(v, k, this)) {
        await results.set(k, v)
      }
    })

    return results
  }

  async destroy() {
    this._data!.clear()
  }

  async get(key: K): Promise<V | undefined> {
    return this._data!.get(key)
  }

  async has(key: K): Promise<boolean> {
    return this._data!.has(key)
  }


  async random(amount: number | undefined): Promise<V[] | V> {
    return this._data!.random(amount)
  }

  async set(key: K, value: V): Promise<CollectionCacheCell<K, V>> {
    this._data!.set(key, value)
    return this
  }

  async size() {
    return this._data!.size
  }

  async entries() {
    return [ ...this._data!.entries() ]
  }
}
