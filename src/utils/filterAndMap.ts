export function filterAndMap<C, R>(array: C[], filter: (thing: C) => boolean, map: (thing: C) => any): R[] {
  return array.reduce<R[]>((filtered: R[], current: C) => {
    if (filter(current)) {
      filtered.push(map(current))
    }

    return filtered
  }, [])
}
