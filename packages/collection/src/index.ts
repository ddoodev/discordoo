export default class Collection<K, V> extends Map<K, V> {
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
}