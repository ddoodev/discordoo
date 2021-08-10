import { CacheProvider } from '@src/core'
import { CacheStorageKey } from '@src/cache/interfaces/CacheStorageKey'

export async function cacheProviderSizePolyfill<P extends CacheProvider = CacheProvider>(
  provider: P, keyspace: string, storage: CacheStorageKey,
): Promise<number> {
  let size = 0

  await provider.forEach(keyspace, storage, () => size++)

  return size
}
