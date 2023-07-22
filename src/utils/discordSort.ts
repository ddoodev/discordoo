export function discordSort(array: Record<string, any>[]): Record<string, any>[] {
  return array.sort((a, b) => {
    return a.rawPosition - b.rawPosition
      || parseInt(b.id.slice(0, -10)) - parseInt(a.id.slice(0, -10))
      || parseInt(b.id.slice(10)) - parseInt(a.id.slice(10))
  })
}
