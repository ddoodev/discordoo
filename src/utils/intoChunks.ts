/** Splits array into several arrays */
export function intoChunks<T = unknown>(array: T[], chunkSize = 1): T[][] {
  const chunks: T[][] = []

  for (let i = 0; i < Math.ceil(array.length / chunkSize); i++) {
    chunks[i] = array.slice(i * chunkSize, i * chunkSize + chunkSize)
  }

  return chunks
}
