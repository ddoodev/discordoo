export function intoChunks<T>(array: T[], chunkSize = 1): T[][] {
  const chunkArray: T[][] = []

  for (let i = 0; i < Math.ceil(array.length / chunkSize); i++) {
    chunkArray[i] = array.slice(i * chunkSize, i * chunkSize + chunkSize)
  }

  return chunkArray
}
