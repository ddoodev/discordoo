/** Creates a range of numbers to x */
export function range(x: number, y?: number) {
  if (y !== undefined) return Array.from({ length: y - x + 1 }, (_, idx) => x + idx)

  return [ ...(Array(x).keys()) ]
}
