export function intoChunks<T>(array: T[], chunkSize = 1): T[][] {
  const subArray: T[][] = []

  for (let i = 0; i < Math.ceil(array.length / chunkSize); i++) {
    subArray[i] = array.slice(i * chunkSize, i * chunkSize + chunkSize)
  }

  return subArray
}
