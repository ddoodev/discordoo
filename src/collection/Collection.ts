import { DiscordooError, range } from '@src/utils'
import { CollectionEqualOptions } from '@src/collection/interfaces/CollectionEqualOptions'
import { CollectionFilterOptions } from '@src/collection/interfaces/CollectionFilterOptions'
import { CollectionRandomOptions } from '@src/collection/interfaces/CollectionRandomOptions'
import { swap } from '@src/utils/swap'
import { intoChunks } from '@src/utils/intoChunks'

let lodashIsEqual: equalFn

try {
  lodashIsEqual = require('lodash/isEqual')
} catch (e) {} // eslint-disable-line no-empty

type equalFn = (value: any, other: any) => boolean

/** An utility data structure used within the library */
export class Collection<K = unknown, V = unknown> extends Map<K, V> {

  /**
  * Returns the collection is empty or not.
  * */
  get empty(): boolean {
    return this.size === 0
  }

  /**
   * Gets a random element from collection (returns non-unique results if the unique option is not specified).
   * */
  random(): V
  random(amount: number, options?: CollectionRandomOptions): V[]
  random(amount?: number, options?: CollectionRandomOptions): V | V[]
  random(amount?: number, options: CollectionRandomOptions = {}): V | V[] {
    const size = this.size

    if (size < 1) throw new DiscordooError('Collection#random', 'Cannot get random elements from the empty collection')
    if (amount && amount > size) amount = size
    if (!amount || (amount && amount < 1)) amount = 1
    if (typeof options.unique !== 'boolean') options.unique = !!options.unique

    // switches the random numbers generation algorithm depending on the size of the collection and the size of the amount
    const largeAmount: boolean = Math.floor(amount / size * 100) > (size > 500 ? size > 1000 ? 15 : 50 : 80),
      arr = [ ...this.values() ]
    let results: V[] = []

    // O(1) generation algorithm, https://stackoverflow.com/questions/196017/unique-non-repeating-random-numbers-in-o1
    if (largeAmount && options.unique) {
      let randomNumbers = range(size + 1),
        max = size

      for (let i = 0; i < size; i++) {
        const num = Math.floor(Math.random() * max)
        randomNumbers = swap(randomNumbers, num, max)
        max -= 1
      }

      for (let i = 0; i < amount; i++) {
        results.push(arr[randomNumbers[i]])
      }
    } else {
      const random: number[] = []

      // O(unknown) generation algorithm. works much faster in small collections, but much worse in big.
      // 1. gen
      // 2. if not unique, start from 1. else
      // 3. push to random numbers array
      if (options.unique) {
        for (let i = 0; i < amount; i++) {
          const num = Math.floor(Math.random() * size)
          random.indexOf(num) > -1 ? i -= 1 : random.push(num) // repeat iteration if number is not unique
        }
      } else {
        for (let i = 0; i < amount; i++) random.push(Math.floor(Math.random() * size))
      }

      results = random.map(r => arr[r])
    }

    return amount <= 1 ? results[0] : results
  }

  /**
   * Filters out the elements which don't meet requirements.
   * @param filter - function to use
   * @param {CollectionFilterOptions?} options - filter options
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
        results = new Map<K, V>()
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
   * Executes a function on each of elements of map.
   * @param predicate - function to use
   */
  forEach(predicate: (value: V, key: K, collection: Collection<K, V>) => unknown) {
    super.forEach((v: V, k: K) => {
      predicate(v, k, this)
    })
  }

  /** Creates a new collection based on this one. */
  clone(): Collection<K, V> {
    return new Collection<K, V>([ ...this ])
  }

  /**
   * Checks if two collections are equal.
   * @param {Collection} collection - collection to compare to
   * @param {CollectionEqualOptions?} options - options to use
   */
  equal(collection: Collection<K, V>, options: CollectionEqualOptions = {}): boolean {
    if (this.size !== collection?.size) return false
    if (this === collection) return true

    let equal: equalFn = (arg1: any, arg2: any) => arg1 === arg2

    if (options.deep) {
      if (!lodashIsEqual) throw new DiscordooError('Collection#equal', 'cannot perform deep equal without lodash installed')
      else equal = (arg1: any, arg2: any) => lodashIsEqual(arg1, arg2)
    }

    for (const [ key, value ] of this.entries()) {
      switch (true) { // switch is faster than if, so we use it in the loop
        case !collection.has(key) || !equal(collection.get(key), value):
          return false
      }
    }

    return true
  }

  /**
  * Merges the specified collections into one and returns a new collection.
  * @param collections - collections to merge
  * */
  concat(collections: Collection<K, V>[]): Collection<K, V> {
    const merged = this.clone()

    for (const collection of collections) {
      if (!collection || !(collection instanceof Collection)) {
        continue
      }

      for (const [ key, value ] of collection.entries()) {
        merged.set(key, value)
      }
    }

    return merged
  }

  /**
  * Checks if any of values satisfies the condition.
  * @param predicate - function to use
  * */
  some(predicate: (value: V, key: K, collection: Collection<K, V>) => boolean): boolean {
    for (const [ key, value ] of this.entries()) {
      if (predicate(value, key, this)) {
        return true
      }
    }

    return false
  }

  /**
  * Checks if all values satisfy the condition.
  * @param predicate - function to use
  * */
  every(predicate: (value: V, key: K, collection: Collection<K, V>) => boolean): boolean {
    for (const [ key, value ] of this.entries()) {
      if (!predicate(value, key, this)) {
        return false
      }
    }

    return true
  }

  /**
  * Returns first N collection values.
  * */
  first(): V | undefined
  first(amount: number): V[]
  first(amount?: number): V | V[] | undefined {
    if (!amount || amount <= 1) {
      return this.values().next().value
    }

    const values = [ ...this.values() ]

    amount = Math.min(values.length, amount)

    return values.slice(0, amount)
  }

  /**
  * Returns first N collection keys.
  * */
  firstKey(): K | undefined
  firstKey(amount: number): K[]
  firstKey(amount?: number): K | K[] | undefined {
    if (!amount || amount <= 1) {
      return this.keys().next().value
    }

    const keys = [ ...this.keys() ]

    amount = Math.min(keys.length, amount)

    return keys.slice(0, amount)
  }

  /**
  * Returns last N collection values.
  * */
  last(): V | undefined
  last(amount: number): V[]
  last(amount?: number): V | V[] | undefined {
    const values = [ ...this.values() ]

    if (!amount || amount <= 1) {
      return values[values.length - 1]
    }

    amount = Math.min(values.length, amount)

    return values.slice(-amount)
  }

  /**
  * Returns last N collection keys.
  * */
  lastKey(): K | undefined
  lastKey(amount: number): K[]
  lastKey(amount?: number): K | K[] | undefined {
    const keys = [ ...this.keys() ]

    if (!amount || amount <= 1) {
      return keys[keys.length - 1]
    }

    amount = Math.min(keys.length, amount)

    return keys.slice(-amount)
  }

  /**
  * Returns a collection chunked into several collections.
  * @param size - chunk size
  * */
  intoChunks(size?: number): Collection<K, V>[] {
    return intoChunks<[K, V]>([ ...this.entries() ], size)
      .map(e => new Collection(e))
  }
}
