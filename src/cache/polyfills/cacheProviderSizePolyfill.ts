import { CacheProvider } from '@src/core'

export async function cacheProviderSizePolyfill<P extends CacheProvider = CacheProvider>(
  provider: P, keyspace: string
): Promise<number> {
  let size = 0

  await provider.forEach(keyspace, () => size++)

  return size
}
