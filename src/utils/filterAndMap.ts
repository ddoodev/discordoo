export function filterAndMap<C, R>(array: C[], filter: (thing: C, filtered: R[]) => boolean, map: (thing: C, mapped: R[]) => any): R[] {
  return array.reduce<R[]>((filtered: R[], current: C) => {
    if (filter(current, filtered)) {
      filtered.push(map(current, filtered))
    }

    return filtered
  }, [])
}
