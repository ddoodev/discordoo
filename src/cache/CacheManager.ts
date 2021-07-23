import { CacheProvider, Client, ProviderConstructor } from '@src/core'
import { CacheManagerOptions } from '@src/cache/interfaces/CacheManagerOptions'
import { CacheManagerGetOptions } from '@src/cache/interfaces/CacheManagerGetOptions'
import { resolveShards } from '@src/utils/resolveShards'
import { IpcCacheOpCodes, IpcOpCodes } from '@src/constants'
import { IpcCacheGetOperationRequestPacket, IpcCacheGetOperationResponsePacket } from '@src/sharding/interfaces/ipc/IpcPackets'

export class CacheManager<P extends CacheProvider = CacheProvider> {
  public client: Client
  public provider: P

  constructor(client: Client, provider: ProviderConstructor<P>, options: CacheManagerOptions) {
    this.client = client
    this.provider = new provider(this.client, options.provider)
  }

  async get<K = string, V = any>(keyspace: string, key: K, options: CacheManagerGetOptions = {}): Promise<V | undefined> {
    let result: any

    if (typeof options?.shard !== 'undefined' && this.client.internals.sharding.active && !this.provider.sharedCache) {
      const shards = resolveShards(this.client, options.shard)

      const packet: IpcCacheGetOperationRequestPacket = {
        op: IpcOpCodes.CACHE_OPERATE,
        d: {
          op: IpcCacheOpCodes.GET,
          event_id: this.client.internals.ipc.generate(),
          key,
          keyspace,
          shards,
          serialize: true
        }
      }

      const { d: response } =
        await this.client.internals.ipc.send<IpcCacheGetOperationResponsePacket>(packet, { waitResponse: true })

      if (response.success) {
        result = response.result
      }

    } else {
      result = await this.provider.get<K, V>(keyspace, key)
    }

    return result
  }

  init() {
    return this.provider.init()
  }
}
