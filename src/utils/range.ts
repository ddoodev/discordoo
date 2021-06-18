/** Creates a range of numbers to x */
export default function range(x: number) {
  return [ ...(Array(x).keys()) ]
}
