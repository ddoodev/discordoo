import { DiscordooError } from '@src/utils'

let lodashIsEqual

try {
  lodashIsEqual = require('lodash/isEqual')
} catch (e) {} // eslint-disable-line no-empty

import CollectionEqualOptions from '@src/collection/interfaces/CollectionEqualOptions'
import CollectionFilterOptions from '@src/collection/interfaces/CollectionFilterOptiions'

/** An utility data structure used within the library */
export class Collection<K = unknown, V = unknown> extends Map<K, V> {

  /** Get a random element from collection (can return several identical results if the amount is specified) */
  random(): V
  random(amount: number): V[]
  random(amount?: number): V | V[]
  random(amount?: number): V | V[] {
    const size = this.size

    if (size < 1) throw new RangeError('Cannot get random elements in the empty collection')

    if (amount && amount > size) amount = size

    const random = Array(amount || 1).fill(Math.floor(Math.random() * size)),
      result: V[] = []
    let index = 0

    this.forEach((value: V) => {
      if (random.indexOf(index) > -1) result.push(value)
      index++
    })

    return result.length === 1 ? result[0] : result
  }

  /**
   * Filter out the elements which don't meet requirements
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
      case 'array':
        results = []
        predicate = (v, k, c) => filter(v, k, c) && results.push([ k, v ])
        break
      case 'map':
        results = new Map()
        predicate = (v, k, c) => filter(v, k, c) && results.set(k, v)
        break
      case 'collection':
        results = new Collection<K, V>()
        predicate = (v, k, c) => filter(v, k, c) && results.set(k, v)
        break
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
   * Execute a function on each of elements of map
   * @param predicate - function to use
   */
  forEach(predicate: (value: V, key: K, collection: Collection<K, V>) => unknown) {
    super.forEach((v: V, k: K) => {
      predicate(v, k, this)
    })
  }

  /** Create a new collection based on this one */
  clone(): Collection<K, V> {
    return new Collection<K, V>([ ...this ])
  }

  /**
   * Check if two collections are equal
   * @param {Collection} collection - collection to compare to
   * @param {CollectionEqualOptions} options - options to use
   */
  equal(collection: Collection<K, V>, options: CollectionEqualOptions = {}): boolean {
    if (this.size !== collection?.size) return false
    if (this === collection) return true

    let equal = (arg1: any, arg2: any) => arg1 === arg2

    if (options.deep) {
      if (!lodashIsEqual) throw new DiscordooError('Collection#equal', 'cannot perform deep equal without lodash installed')
      else equal = (arg1: any, arg2: any) => lodashIsEqual(arg1, arg2)
    }

    for (const [ key, value ] of this) {
      switch (true) { // switch is faster than if, so we use it in the loop
        case !collection.has(key) || !equal(collection.get(key), value):
          return false
      }
    }

    return true

  }
}
