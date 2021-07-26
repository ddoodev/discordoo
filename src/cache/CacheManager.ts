import { CacheProvider, Client, ProviderConstructor } from '@src/core'
import { CacheManagerOptions } from '@src/cache/interfaces/CacheManagerOptions'
import { CacheManagerGetOptions } from '@src/cache/interfaces/CacheManagerGetOptions'
import { resolveShards } from '@src/utils/resolveShards'
import { IpcCacheOpCodes, IpcOpCodes, SerializeModes } from '@src/constants'
import {
  IpcCacheDeleteRequestPacket,
  IpcCacheDeleteResponsePacket,
  IpcCacheFilterRequestPacket,
  IpcCacheFilterResponsePacket,
  IpcCacheFindRequestPacket,
  IpcCacheFindResponsePacket,
  IpcCacheForEachRequestPacket,
  IpcCacheForEachResponsePacket,
  IpcCacheGetRequestPacket,
  IpcCacheGetResponsePacket,
  IpcCacheHasRequestPacket,
  IpcCacheHasResponsePacket,
  IpcCacheMapRequestPacket,
  IpcCacheMapResponsePacket,
  IpcCacheSetRequestPacket,
  IpcCacheSetResponsePacket,
  IpcCacheSizeRequestPacket,
  IpcCacheSizeResponsePacket,
  IpcCacheSweepRequestPacket,
  IpcCacheSweepResponsePacket
} from '@src/sharding/interfaces/ipc/IpcPackets'
import { CacheManagerSetOptions } from '@src/cache/interfaces/CacheManagerSetOptions'
import { DiscordooError } from '@src/utils'
import { CacheManagerDeleteOptions } from '@src/cache/interfaces/CacheManagerDeleteOptions'
import { CacheManagerForEachOptions } from '@src/cache/interfaces/CacheManagerForEachOptions'
import { CacheManagerSizeOptions } from '@src/cache/interfaces/CacheManagerSizeOptions'
import { cacheProviderSizePolyfill } from '@src/cache/polyfills/cacheProviderSizePolyfill'
import { cacheProviderHasPolyfill } from '@src/cache/polyfills/cacheProviderHasPolyfill'
import { cacheProviderSweepPolyfill } from '@src/cache/polyfills/cacheProviderSweepPolyfill'
import { CacheManagerHasOptions } from '@src/cache/interfaces/CacheManagerHasOptions'
import { CacheManagerSweepOptions } from '@src/cache/interfaces/CacheManagerSweepOptions'
import { CacheManagerFilterOptions } from '@src/cache/interfaces/CacheManagerFilterOptions'
import { cacheProviderFilterPolyfill } from '@src/cache/polyfills/cacheProviderFilterPolyfill'
import { CacheManagerMapOptions } from '@src/cache/interfaces/CacheManagerMapOptions'
import { cacheProviderMapPolyfill } from '@src/cache/polyfills/cacheProviderMapPolyfill'
import { cacheProviderFindPolyfill } from '@src/cache/polyfills/cacheProviderFindPolyfill'
import { CachingPoliciesProcessor } from '@src/cache/CachingPoliciesProcessor'

export class CacheManager<P extends CacheProvider = CacheProvider> {
  public client: Client
  public provider: P

  private policiesProcessor: CachingPoliciesProcessor

  constructor(client: Client, provider: ProviderConstructor<P>, options: CacheManagerOptions) {
    this.client = client
    this.provider = new provider(this.client, options.provider)
    this.policiesProcessor = new CachingPoliciesProcessor(client)
  }

  async get<K = string, V = any>(keyspace: string, key: K, options: CacheManagerGetOptions = {}): Promise<V | undefined> {
    let result: any

    if (typeof options?.shard !== 'undefined' && this.client.internals.sharding.active && !this.provider.sharedCache) {
      const shards = resolveShards(this.client, options.shard)

      const request: IpcCacheGetRequestPacket = {
        op: IpcOpCodes.CACHE_OPERATE,
        d: {
          op: IpcCacheOpCodes.GET,
          event_id: this.client.internals.ipc.generate(),
          key,
          keyspace,
          shards,
          serialize: SerializeModes.BOOLEAN
        }
      }

      const { d: response } =
        await this.client.internals.ipc.send<IpcCacheGetResponsePacket>(request, { waitResponse: true })

      if (response.success) {
        result = response.result
      }

    } else {
      result = await this.provider.get<K, V>(keyspace, key)
    }

    return result
  }

  async set<K = string, V = any>(keyspace: string, key: K, value: V, options: CacheManagerSetOptions = {}): Promise<CacheManager> {
    const globalPolicyLimit = this.policiesProcessor.global(value)
    if (typeof globalPolicyLimit !== 'undefined') {
      if (!globalPolicyLimit) return this
    }

    if (!this.provider.classesCompatible) {
      // @ts-expect-error
      if (typeof value.toJSON === 'function') value = value.toJSON()
    }

    if (typeof options?.shard !== 'undefined' && this.client.internals.sharding.active && !this.provider.sharedCache) {
      const shards = resolveShards(this.client, options.shard)

      const request: IpcCacheSetRequestPacket = {
        op: IpcOpCodes.CACHE_OPERATE,
        d: {
          op: IpcCacheOpCodes.SET,
          event_id: this.client.internals.ipc.generate(),
          key,
          keyspace,
          shards,
          value,
          serialize: SerializeModes.BOOLEAN
        }
      }

      const { d: response } =
        await this.client.internals.ipc.send<IpcCacheSetResponsePacket>(request, { waitResponse: true })

      if (!response.success) {
        throw new DiscordooError(...response.result)
      }

    } else {
      await this.provider.set<K, V>(keyspace, key, value)
    }

    return this
  }

  async delete<K = string>(keyspace: string, key: K | K[], options: CacheManagerDeleteOptions = {}): Promise<boolean> {
    if (typeof options?.shard !== 'undefined' && this.client.internals.sharding.active && !this.provider.sharedCache) {
      const shards = resolveShards(this.client, options.shard)

      const request: IpcCacheDeleteRequestPacket = {
        op: IpcOpCodes.CACHE_OPERATE,
        d: {
          op: IpcCacheOpCodes.DELETE,
          event_id: this.client.internals.ipc.generate(),
          key,
          keyspace,
          shards,
          serialize: SerializeModes.BOOLEAN
        }
      }

      const { d: response } =
        await this.client.internals.ipc.send<IpcCacheDeleteResponsePacket>(request, { waitResponse: true })

      return response.success

    } else {
      return this.provider.delete<K>(keyspace, key)
    }
  }

  async forEach<K = string, V = any>(
    keyspace: string, predicate: (value: V, key: K, provider: P) => unknown | Promise<unknown>, options: CacheManagerForEachOptions = {}
  ): Promise<void> {
    if (typeof options?.shard !== 'undefined' && this.client.internals.sharding.active && !this.provider.sharedCache) {
      const shards = resolveShards(this.client, options.shard)

      const request: IpcCacheForEachRequestPacket = {
        op: IpcOpCodes.CACHE_OPERATE,
        d: {
          op: IpcCacheOpCodes.FOREACH,
          event_id: this.client.internals.ipc.generate(),
          keyspace,
          shards,
          script: `(${predicate})`
        }
      }

      await this.client.internals.ipc.send<IpcCacheForEachResponsePacket>(request, { waitResponse: true })

    } else {
      await this.provider.forEach<K, V, P>(keyspace, predicate)
    }

    return void 0
  }

  async size(keyspace: string, options: CacheManagerSizeOptions = {}): Promise<number> {
    let result = 0

    if (typeof options?.shard !== 'undefined' && this.client.internals.sharding.active && !this.provider.sharedCache) {
      const shards = resolveShards(this.client, options.shard)

      const request: IpcCacheSizeRequestPacket = {
        op: IpcOpCodes.CACHE_OPERATE,
        d: {
          op: IpcCacheOpCodes.SIZE,
          event_id: this.client.internals.ipc.generate(),
          keyspace,
          shards,
          serialize: SerializeModes.NUMBER
        }
      }

      const { d: response } =
        await this.client.internals.ipc.send<IpcCacheSizeResponsePacket>(request, { waitResponse: true })

      if (response.success) {
        result = response.result
      }

    } else {

      if (this.provider.size) {
        result = await this.provider.size(keyspace)
      } else {
        result = await cacheProviderSizePolyfill<P>(this.provider, keyspace)
      }

    }

    return result
  }

  async has<K = string>(keyspace: string, key: K, options: CacheManagerHasOptions = {}): Promise<boolean> {
    let result = false

    if (typeof options?.shard !== 'undefined' && this.client.internals.sharding.active && !this.provider.sharedCache) {
      const shards = resolveShards(this.client, options.shard)

      const request: IpcCacheHasRequestPacket = {
        op: IpcOpCodes.CACHE_OPERATE,
        d: {
          op: IpcCacheOpCodes.HAS,
          event_id: this.client.internals.ipc.generate(),
          keyspace,
          key,
          shards,
          serialize: SerializeModes.BOOLEAN
        }
      }

      const { d: response } =
        await this.client.internals.ipc.send<IpcCacheHasResponsePacket>(request, { waitResponse: true })

      if (response.success) {
        result = response.result
      }

    } else {

      if (this.provider.has) {
        result = await this.provider.has<K>(keyspace, key)
      } else {
        result = await cacheProviderHasPolyfill<K, P>(this.provider, keyspace, key)
      }

    }

    return result
  }

  async sweep<K = string, V = any>(
    keyspace: string, predicate: (value: V, key: K, provider: P) => boolean | Promise<boolean>, options: CacheManagerSweepOptions = {}
  ): Promise<void> {

    if (typeof options?.shard !== 'undefined' && this.client.internals.sharding.active && !this.provider.sharedCache) {
      const shards = resolveShards(this.client, options.shard)

      const request: IpcCacheSweepRequestPacket = {
        op: IpcOpCodes.CACHE_OPERATE,
        d: {
          op: IpcCacheOpCodes.SWEEP,
          event_id: this.client.internals.ipc.generate(),
          keyspace,
          shards,
          script: `(${predicate})`
        }
      }

      await this.client.internals.ipc.send<IpcCacheSweepResponsePacket>(request, { waitResponse: true })

    } else {

      if (this.provider.sweep) {
        await this.provider.sweep<K, V, P>(keyspace, predicate)
      } else {
        await cacheProviderSweepPolyfill<K, V, P>(this.provider, keyspace, predicate)
      }

    }

    return void 0
  }

  async filter<K = string, V = any>(
    keyspace: string, predicate: (value: V, key: K, provider: P) => boolean | Promise<boolean>, options: CacheManagerFilterOptions = {}
  ): Promise<[ K, V ][]> {
    let result: [ K, V ][] = []

    if (typeof options?.shard !== 'undefined' && this.client.internals.sharding.active && !this.provider.sharedCache) {
      const shards = resolveShards(this.client, options.shard)

      const request: IpcCacheFilterRequestPacket = {
        op: IpcOpCodes.CACHE_OPERATE,
        d: {
          op: IpcCacheOpCodes.FILTER,
          event_id: this.client.internals.ipc.generate(),
          keyspace,
          shards,
          script: `(${predicate})`,
          serialize: SerializeModes.ARRAY
        }
      }

      const { d: response } =
        await this.client.internals.ipc.send<IpcCacheFilterResponsePacket>(request, { waitResponse: true })

      if (response.success) {
        result = response.result
      }

    } else {

      if (this.provider.filter) {
        result = await this.provider.filter<K, V, P>(keyspace, predicate)
      } else {
        result = await cacheProviderFilterPolyfill<K, V, P>(this.provider, keyspace, predicate)
      }

    }

    return result
  }

  async map<K = string, V = any, R = any>(
    keyspace: string, predicate: (value: V, key: K, provider: P) => R | Promise<R>, options: CacheManagerMapOptions = {}
  ): Promise<R[]> {
    let result: R[] = []

    if (typeof options?.shard !== 'undefined' && this.client.internals.sharding.active && !this.provider.sharedCache) {
      const shards = resolveShards(this.client, options.shard)

      const request: IpcCacheMapRequestPacket = {
        op: IpcOpCodes.CACHE_OPERATE,
        d: {
          op: IpcCacheOpCodes.MAP,
          event_id: this.client.internals.ipc.generate(),
          keyspace,
          shards,
          script: `(${predicate})`,
          serialize: SerializeModes.ARRAY
        }
      }

      const { d: response } =
        await this.client.internals.ipc.send<IpcCacheMapResponsePacket>(request, { waitResponse: true })

      if (response.success) {
        result = response.result
      }

    } else {

      if (this.provider.map) {
        result = await this.provider.map<K, V, R, P>(keyspace, predicate)
      } else {
        result = await cacheProviderMapPolyfill<K, V, R, P>(this.provider, keyspace, predicate)
      }

    }

    return result
  }

  async find<K = string, V = any>(
    keyspace: string, predicate: (value: V, key: K, provider: P) => boolean | Promise<boolean>, options: CacheManagerMapOptions = {}
  ): Promise<V | undefined> {
    let result: V | undefined

    if (typeof options?.shard !== 'undefined' && this.client.internals.sharding.active && !this.provider.sharedCache) {
      const shards = resolveShards(this.client, options.shard)

      const request: IpcCacheFindRequestPacket = {
        op: IpcOpCodes.CACHE_OPERATE,
        d: {
          op: IpcCacheOpCodes.FIND,
          event_id: this.client.internals.ipc.generate(),
          keyspace,
          shards,
          script: `(${predicate})`,
          serialize: SerializeModes.ANY
        }
      }

      const { d: response } =
        await this.client.internals.ipc.send<IpcCacheFindResponsePacket>(request, { waitResponse: true })

      if (response.success) {
        result = response.result
      }

    } else {

      if (this.provider.find) {
        result = await this.provider.find<K, V, P>(keyspace, predicate)
      } else {
        result = await cacheProviderFindPolyfill<K, V, P>(this.provider, keyspace, predicate)
      }

    }

    return result
  }

  init() {
    return this.provider.init()
  }
}
