import _ from 'lodash'

export default class Collection<K, V> extends Map<K, V>   {
  random(amount?: number): V[] | V {
    const getRandomElement = () => this.get([...this.keys()][Math.floor(Math.random() * this.size)])
    if(amount === undefined) {
      return getRandomElement()!
    } else {
      if(amount > this.size) throw new RangeError('Cannot get more random elements that are in the Collection')
      else if(amount === this.size) return [...this.values()]
      const result = []
      for(const i of Array(amount).fill(228)) {
        result.push(getRandomElement()!)
      }
      return result
    }
  }

  filter(filter: (value: V, key: K, collection: Collection<K, V>) => boolean): Collection<K, V> {
    const entries = [...this.entries()]

    return new Collection<K, V>(entries.filter((v) => filter(v[1], v[0], this)))
  }

  clone(): Collection<K, V> {
    return new Collection<K, V>([...this])
  }

  equal(collection: Collection<K, V>): boolean {
    if(this.size !== collection.size) return false
    for(const [key, val] of this) {
      if(!collection.has(key)) return false
      const testValue = collection.get(key)!
      if(!_.isEqual(val, testValue)) return false
    }
    return true
  }
}