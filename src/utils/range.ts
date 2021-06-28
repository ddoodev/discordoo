/** Creates a range of numbers to x */
export function range(x: number, y?: number) {
  if (y !== undefined) return Array(y - x + 1).fill(void 0).map((_, idx) => x + idx)

  return [ ...(Array(x).keys()) ]
}
