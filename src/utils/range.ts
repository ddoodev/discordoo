/** Creates a range of numbers to x */
export function range(x: number) {
  return [ ...(Array(x).keys()) ]
}
