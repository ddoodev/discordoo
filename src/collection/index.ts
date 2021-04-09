import isEqual from 'lodash/isEqual'

/** An utility data structure used within the library */
export class Collection<K, V> extends Map<K, V> {
  /**
   * Get a random element from collection
   * @param amount - amount of elements to be retrieved
   */
  random(amount?: number): V[] | V {
    const getRandomElement = () => this.get([ ...this.keys() ][Math.floor(Math.random() * this.size)])
    if (amount === undefined) {
      return getRandomElement()!
    } else {
      if (amount > this.size) throw new RangeError('Cannot get more random elements that are in the Collection')
      else if (amount === this.size) return [ ...this.values() ]
      const result: any[] = []

      // eslint-disable-next-line
      for (const i of Array(amount).fill(228)) {
        result.push(getRandomElement()!)
      }
      return result
    }
  }

  /**
   * Filter out the elements which don't meet requirements
   * @param filter - function which filters
   */
  filter(filter: (value: V, key: K, collection: Collection<K, V>) => boolean): Collection<K, V> {
    const entries = [ ...this.entries() ]

    return new Collection<K, V>(entries.filter((v) => filter(v[1], v[0], this)))
  }

  /** Create a new collection based on this one */
  clone(): Collection<K, V> {
    return new Collection<K, V>([ ...this ])
  }

  /**
   * Check if two collections are equal
   * @param collection - collection to compare to
   */
  equal(collection: Collection<K, V>): boolean { // looks like O(n), if it isn't, refactor
    if (this.size !== collection.size) return false
    for (const [ key, val ] of this) {
      if (!collection.has(key)) return false
      const testValue = collection.get(key)!
      if (!isEqual(val, testValue)) return false
    }
    return true
  }
}
