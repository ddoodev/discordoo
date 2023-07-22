import { CacheProvider, CacheStorageKey } from '@discordoo/providers'

export async function cacheProviderSizePolyfill<P extends CacheProvider = CacheProvider>(
  provider: P, keyspace: string, storage: CacheStorageKey,
): Promise<number> {
  let size = 0

  await provider.forEach(keyspace, storage, () => size++)

  return size
}
