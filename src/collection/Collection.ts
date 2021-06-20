import { DiscordooError } from '@src/utils'
import CollectionEqualOptions from '@src/collection/interfaces/CollectionEqualOptions'
import CollectionFilterOptions from '@src/collection/interfaces/CollectionFilterOptions'
import CollectionRandomOptions from '@src/collection/interfaces/CollectionRandomOptions'

let lodashIsEqual: equalFn

try {
  lodashIsEqual = require('lodash/isEqual')
} catch (e) {} // eslint-disable-line no-empty

/** An utility data structure used within the library */
export default class Collection<K = unknown, V = unknown> extends Map<K, V> {
  /**
   * Gets a random element from collection (can return several identical results if the amount is specified).
   * */
  random(): V
  random(amount: number, options?: CollectionRandomOptions): V[]
  random(amount?: number, options?: CollectionRandomOptions): V | V[]
  random(amount?: number, options: CollectionRandomOptions = {}): V | V[] {
    const size = this.size

    if (size < 1) throw new RangeError('Cannot get random elements in the empty collection')

    if (amount) {
      if (amount < 1) {
        throw new RangeError('Cannot get less than 1 element from collection')
      }

      if (amount > size) {
        amount = size
      }
    } else {
      return this.getValues()[Math.floor(Math.random() * size)]
    }

    if (amount === 1) {
      return this.getValues()[Math.floor(Math.random() * size)]
    }

    const result: V[] = []
    const values: V[] = this.getValues()

    if (options.unique) {
      const random: number[] = []

      for (let i = 0; i < amount; i++) {
        const num: number = Math.floor(Math.random() * size)
        if (random.indexOf(num) > -1) {
          i -= 1
        } else {
          random.push(num)
          result.push(values[num])
        }
      }
    } else {
      for (let i = 0; i < amount; i++) {
        result.push(values[Math.floor(Math.random() * size)])
      }
    }

    return result
  }

  /**
   * Filters out the elements which don't meet requirements.
   */
  filter<T>(
    filter: (value: V, key: K, collection: Collection<K, V>) => unknown,
    options?: CollectionFilterOptions
  ): T extends Array<any> ? Array<[ K, V ]> : T
  filter(
    filter: (value: V, key: K, collection: Collection<K, V>) => unknown,
    options: CollectionFilterOptions = {}
  ): Collection<K, V> | Array<[ K, V ]> | Map<K, V> {
    let results, predicate

    switch (options.return) {
      case 'map':
        results = new Map()
        predicate = (v, k, c) => filter(v, k, c) && results.set(k, v)
        break
      case 'collection':
        results = new Collection<K, V>()
        predicate = (v, k, c) => filter(v, k, c) && results.set(k, v)
        break
      case 'array':
      default:
        results = []
        predicate = (v, k, c) => filter(v, k, c) && results.push([ k, v ])
        break
    }

    for (const [ value, key ] of this.entries()) {
      predicate(value, key, this)
    }

    return results
  }

  /**
   * Executes a function on each of the elements of the map.
   * @param predicate - function to use
   */
  forEach(predicate: (value: V, key: K, collection: Collection<K, V>) => unknown) {
    super.forEach((v: V, k: K) => {
      predicate(v, k, this)
    })
  }

  /**
   *  Creates a new collection based on this one.
   *  */
  clone(): Collection<K, V> {
    return new Collection<K, V>([ ...this ])
  }

  /**
   * Checks if two collections are equal.
   * @param {Collection} collection - collection to compare to
   * @param {CollectionEqualOptions} options - options to use
   */
  equal(collection: Collection<K, V>, options: CollectionEqualOptions = {}): boolean {
    if (this.size !== collection?.size) return false
    if (this === collection) return true

    if (options.deep) {
      if (!lodashIsEqual) throw new DiscordooError('Collection#equal', 'cannot perform deep equal without lodash installed')
    }

    for (const [ key, value ] of this.entries()) {
      switch (true) { // switch is faster than if, so we use it in the loop
        case !collection.has(key) || !lodashIsEqual(collection.get(key), value):
          return false
      }
    }

    return true
  }

  /*
  * Checks if collection is empty.
  * */
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * Checks if collection has specified value.
   * @param value - value to compare with
   * */
  hasValue(value: V): boolean {
    for (const [k, v] of this.entries()) {
      if (v === value) {
        return true
      }
    }

    return false
  }

  /**
   * Returns the value to which the specified key is mapped,
   * or defaultValue if this map contains no mapping for the key.
   * @param key - key to get the value of
   * @param defaultValue - value to return if key value does not exist
   * */
  getOrDefault(key: K, defaultValue: V): V {
    return this.get(key) || defaultValue
  }

  /*
  * If the specified key is not already associated with a value (or is mapped to null)
  * associates it with the given value and returns null, else returns the current value.
  * */
  setIfAbsent(key: K, value: V): V | null {
    if (this.has(key) && !this.get(key)) {
      this.set(key, value)
      return value
    }

    return null
  }

  /*
  * Copies all of the mappings from the specified map / collection to this collection.
  * */
  setAll<K1 extends K, V1 extends V>(map: Map<K1, V1> | Collection<K1, V1>): void {
    for (const [key, value] of map) {
      this.set(key, value)
    }
  }

  /*
  * Returns a set of keys contained in this map.
  * */
  getKeySet(): Set<K> {
    return new Set<K>([...this.keys()])
  }

  /*
  * Returns a set of collection values.
  * */
  getValueSet(): Set<V> {
    return new Set<V>([...this.values()])
  }

  /*
  * Returns a set of collection entries.
  * */
  getEntrySet(): Set<[K, V]> {
    return new Set<[K, V]>([...this.entries()])
  }

  /*
  * Returns an array of collection keys.
  * */
  getKeys(): K[] {
    return [...this.keys()]
  }

  /*
  * Returns an array of collection values.
  * */
  getValues(): V[] {
    return [...this.values()]
  }

  /*
  * Returns an array of collection entries.
  * */
  getEntries(): [K, V][] {
    return [...this.entries()]
  }

  /*
  * Returns merged collection.
  * */
  merge(...collections: Collection<K, V>[]): Collection<K, V> {
    const merged = this

    for (const collection of collections) {
      if (!collection) {
        continue
      }

      merged.setAll(collection)
    }

    return merged
  }
}

type equalFn = (arg1: any, arg2: any) => boolean
