import { CachingPoliciesProcessor } from '@src/cache/CachingPoliciesProcessor'
import { IpcCacheOpCodes, IpcOpCodes, SerializeModes } from '@src/constants'
import { CacheProvider, CacheStorageKey } from '@discordoo/providers'
import { resolveShards, DiscordooError } from '@src/utils'
import { Client, ProviderConstructor } from '@src/core'
import { EntitiesUtil, EntityKey } from '@src/api/entities'
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
import {
  cacheProviderFilterPolyfill,
  cacheProviderFindPolyfill,
  cacheProviderHasPolyfill,
  cacheProviderMapPolyfill,
  cacheProviderSizePolyfill,
  cacheProviderSweepPolyfill
} from '@src/cache/polyfills'
import {
  CacheManagerForEachOptions,
  CacheManagerDeleteOptions,
  CacheManagerFilterOptions,
  CacheManagerSweepOptions,
  CacheManagerSizeOptions,
  CacheManagerFindOptions,
  CacheManagerGetOptions,
  CacheManagerHasOptions,
  CacheManagerMapOptions,
  CacheManagerSetOptions,
  CacheManagerOptions
} from '@src/cache/interfaces'

export class CacheManager<P extends CacheProvider = CacheProvider> {
  public client: Client
  public provider: P

  private readonly _policiesProcessor: CachingPoliciesProcessor

  constructor(client: Client, Provider: ProviderConstructor<P>, options: CacheManagerOptions) {
    this.client = client
    this.provider = new Provider(this.client, options.provider)
    this._policiesProcessor = new CachingPoliciesProcessor(this.client)
  }

  async get<K = string, V = any>(
    keyspace: string,
    storage: CacheStorageKey,
    entityKey: EntityKey,
    key: K,
    options: CacheManagerGetOptions = {}
  ): Promise<V | undefined> {
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
          storage,
          entityKey,
          shards,
          serialize: SerializeModes.ANY
        }
      }

      const { d: response } =
        await this.client.internals.ipc.send<IpcCacheGetResponsePacket>(request, { waitResponse: true })

      if (response.success) {
        result = response.result
      }

    } else {
      result = await this.provider.get<K, V>(keyspace, storage, key)
    }

    result = await this._prepareData('out', result, entityKey)

    return result
  }

  async set<K = string, V = any>(
    keyspace: string,
    storage: CacheStorageKey,
    entityKey: EntityKey,
    key: K,
    value: V,
    options: CacheManagerSetOptions = {}
  ): Promise<this> {
    const globalPolicyLimit = this._policiesProcessor.global(value)
    if (typeof globalPolicyLimit !== 'undefined') {
      if (!globalPolicyLimit) return this
    }

    const data = await this._prepareData('in', value, entityKey, this.isShardedRequest(options))

    if (this.isShardedRequest(options)) {
      const shards = resolveShards(this.client, options.shard!)

      const request: IpcCacheSetRequestPacket = {
        op: IpcOpCodes.CACHE_OPERATE,
        d: {
          op: IpcCacheOpCodes.SET,
          event_id: this.client.internals.ipc.generate(),
          key,
          keyspace,
          storage,
          entityKey,
          shards,
          value: data,
          serialize: SerializeModes.BOOLEAN
        }
      }

      const { d: response } =
        await this.client.internals.ipc.send<IpcCacheSetResponsePacket>(request, { waitResponse: true })

      if (!response.success) {
        throw new DiscordooError(...response.result)
      }

    } else {
      await this.provider.set<K, V>(keyspace, storage, key, data)
    }

    return this
  }

  async delete<K = string>(
    keyspace: string,
    storage: CacheStorageKey,
    key: K | K[],
    options: CacheManagerDeleteOptions = {}
  ): Promise<boolean> {
    if (this.isShardedRequest(options)) {
      const shards = resolveShards(this.client, options.shard!)

      const request: IpcCacheDeleteRequestPacket = {
        op: IpcOpCodes.CACHE_OPERATE,
        d: {
          op: IpcCacheOpCodes.DELETE,
          event_id: this.client.internals.ipc.generate(),
          key,
          keyspace,
          storage,
          shards,
          serialize: SerializeModes.BOOLEAN
        }
      }

      const { d: response } =
        await this.client.internals.ipc.send<IpcCacheDeleteResponsePacket>(request, { waitResponse: true })

      return response.success

    } else {
      return this.provider.delete<K>(keyspace, storage, key)
    }
  }

  async forEach<K = string, V = any>(
    keyspace: string,
    storage: CacheStorageKey,
    entityKey: EntityKey,
    predicate: (value: V, key: K, provider: P) => (unknown | Promise<unknown>),
    options: CacheManagerForEachOptions = {}
  ): Promise<void> {
    if (this.isShardedRequest(options)) {
      const shards = resolveShards(this.client, options.shard!)

      const request: IpcCacheForEachRequestPacket = {
        op: IpcOpCodes.CACHE_OPERATE,
        d: {
          op: IpcCacheOpCodes.FOREACH,
          event_id: this.client.internals.ipc.generate(),
          keyspace,
          storage,
          entityKey,
          shards,
          script: `(${predicate})`
        }
      }

      await this.client.internals.ipc.send<IpcCacheForEachResponsePacket>(request, { waitResponse: true })

    } else {
      await this.provider.forEach<K, V, P>(keyspace, storage, this._makePredicate(entityKey, predicate))
    }

    return undefined
  }

  async size(
    keyspace: string,
    storage: CacheStorageKey,
    options: CacheManagerSizeOptions = {}
  ): Promise<number> {
    let result = 0

    if (typeof options?.shard !== 'undefined' && this.client.internals.sharding.active && !this.provider.sharedCache) {
      const shards = resolveShards(this.client, options.shard)

      const request: IpcCacheSizeRequestPacket = {
        op: IpcOpCodes.CACHE_OPERATE,
        d: {
          op: IpcCacheOpCodes.SIZE,
          event_id: this.client.internals.ipc.generate(),
          keyspace,
          storage,
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
        result = await this.provider.size(keyspace, storage)
      } else {
        result = await cacheProviderSizePolyfill<P>(this.provider, keyspace, storage)
      }

    }

    return result
  }

  async has<K = string>(
    keyspace: string,
    storage: CacheStorageKey,
    key: K,
    options: CacheManagerHasOptions = {}
  ): Promise<boolean> {
    let result = false

    if (typeof options?.shard !== 'undefined' && this.client.internals.sharding.active && !this.provider.sharedCache) {
      const shards = resolveShards(this.client, options.shard)

      const request: IpcCacheHasRequestPacket = {
        op: IpcOpCodes.CACHE_OPERATE,
        d: {
          op: IpcCacheOpCodes.HAS,
          event_id: this.client.internals.ipc.generate(),
          keyspace,
          storage,
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
        result = await this.provider.has<K>(keyspace, storage, key)
      } else {
        result = await cacheProviderHasPolyfill<K, P>(this.provider, keyspace, storage, key)
      }

    }

    return result
  }

  async sweep<K = string, V = any>(
    keyspace: string,
    storage: CacheStorageKey,
    entityKey: EntityKey,
    predicate: (value: V, key: K, provider: P) => (boolean | Promise<boolean>),
    options: CacheManagerSweepOptions = {}
  ): Promise<void> {

    if (this.isShardedRequest(options)) {
      const shards = resolveShards(this.client, options.shard!)

      const request: IpcCacheSweepRequestPacket = {
        op: IpcOpCodes.CACHE_OPERATE,
        d: {
          op: IpcCacheOpCodes.SWEEP,
          event_id: this.client.internals.ipc.generate(),
          keyspace,
          storage,
          entityKey,
          shards,
          script: `(${predicate})`
        }
      }

      await this.client.internals.ipc.send<IpcCacheSweepResponsePacket>(request, { waitResponse: true })

    } else {

      if (this.provider.sweep) {
        await this.provider.sweep<K, V, P>(keyspace, storage, this._makePredicate(entityKey, predicate))
      } else {
        await cacheProviderSweepPolyfill<K, V, P>(this.provider, keyspace, storage, this._makePredicate(entityKey, predicate))
      }

    }

    return undefined
  }

  async filter<K = string, V = any>(
    keyspace: string,
    storage: CacheStorageKey,
    entityKey: EntityKey,
    predicate: (value: V, key: K, provider: P) => (boolean | Promise<boolean>),
    options: CacheManagerFilterOptions = {}
  ): Promise<[ K, V ][]> {
    let result: [ K, V ][] = []

    if (this.isShardedRequest(options)) {
      const shards = resolveShards(this.client, options.shard!)

      const request: IpcCacheFilterRequestPacket = {
        op: IpcOpCodes.CACHE_OPERATE,
        d: {
          op: IpcCacheOpCodes.FILTER,
          event_id: this.client.internals.ipc.generate(),
          keyspace,
          storage,
          entityKey,
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
        result = await this.provider.filter<K, V, P>(keyspace, storage, this._makePredicate(entityKey, predicate))
      } else {
        result = await cacheProviderFilterPolyfill<K, V, P>(this.provider, keyspace, storage, this._makePredicate(entityKey, predicate))
      }

    }

    return result
  }

  async map<K = string, V = any, R = any>(
    keyspace: string,
    storage: CacheStorageKey,
    entityKey: EntityKey,
    predicate: (value: V, key: K, provider: P) => (R | Promise<R>),
    options: CacheManagerMapOptions = {}
  ): Promise<R[]> {
    let result: R[] = []

    if (this.isShardedRequest(options)) {
      const shards = resolveShards(this.client, options.shard!)

      const request: IpcCacheMapRequestPacket = {
        op: IpcOpCodes.CACHE_OPERATE,
        d: {
          op: IpcCacheOpCodes.MAP,
          event_id: this.client.internals.ipc.generate(),
          keyspace,
          storage,
          entityKey,
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
        result = await this.provider.map<K, V, R, P>(keyspace, storage, this._makePredicate(entityKey, predicate))
      } else {
        result = await cacheProviderMapPolyfill<K, V, R, P>(this.provider, keyspace, storage, this._makePredicate(entityKey, predicate))
      }

    }

    return result
  }

  async find<K = string, V = any>(
    keyspace: string,
    storage: CacheStorageKey,
    entityKey: EntityKey,
    predicate: (value: V, key: K, provider: P) => (boolean | Promise<boolean>),
    options: CacheManagerFindOptions = {}
  ): Promise<V | undefined> {
    let result: V | undefined

    if (this.isShardedRequest(options)) {
      const shards = resolveShards(this.client, options.shard!)

      const request: IpcCacheFindRequestPacket = {
        op: IpcOpCodes.CACHE_OPERATE,
        d: {
          op: IpcCacheOpCodes.FIND,
          event_id: this.client.internals.ipc.generate(),
          keyspace,
          storage,
          entityKey,
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
        result = await this.provider.find<K, V, P>(keyspace, storage, this._makePredicate(entityKey, predicate))
      } else {
        result = await cacheProviderFindPolyfill<K, V, P>(this.provider, keyspace, storage, this._makePredicate(entityKey, predicate))
      }

    }

    return result
  }

  [Symbol.for('_ddooMakePredicate')](entityKey: EntityKey, predicate: any) { // for internal use by a library outside of this class
    return this._makePredicate(entityKey, predicate)
  }

  get [Symbol.for('_ddooPoliciesProcessor')](): CachingPoliciesProcessor { // for internal use by a library outside of this class
    return this._policiesProcessor
  }

  init() {
    return this.provider.init()
  }

  private isShardedRequest(options?: any): boolean {
    return typeof options.shard !== 'undefined' && this.client.internals.sharding.active && !this.provider.sharedCache
  }

  private _makePredicate(entityKey: EntityKey, predicate: any): any {
    return async (value, key, prov) => {
      return predicate(await this._prepareData('out', value, entityKey), key, prov)
    }
  }

  private async _prepareData(direction: 'in' | 'out', data: any, entityKey: EntityKey, forIpcRequest?: boolean): Promise<any> {
    const k = typeof entityKey === 'function' ? entityKey(data) : entityKey
    const Entity: any = EntitiesUtil.get(k)

    function toJson(d, returnStr?: boolean) {
      if (d) {
        if (returnStr) {
          if (typeof d.toJson === 'function') return JSON.stringify(d.toJson())
          return JSON.stringify(d)
        } else {
          if (typeof d.toJson === 'function') return d.toJson()
          return JSON.parse(JSON.stringify(d))
        }
      }

      return d
    }

    if (forIpcRequest) return toJson(data)

    // 'in' = to the cache provider
    // 'out' = from the cache provider
    switch (direction) {
      case 'in':
        switch (this.provider.compatible) {
          case 'classes':
            if (data && !(data instanceof Entity)) data = await (new Entity(this.client)).init?.(data)
            break
          case 'json':
            data = toJson(data)
            break
          case 'text':
            data = toJson(data, true)
            break
          case 'buffer':
            data = Buffer.from(toJson(data, true))
            break
        }
        break
      case 'out':
        console.log('HEYYO OUT')
        if (data && !(data instanceof Entity)) {
          switch (this.provider.compatible) {
            case 'classes':
            case 'json':
              data = new Entity(this.client).init?.(data)
              break
            case 'text':
              data = new Entity(this.client).init?.(JSON.parse(data))
              break
            case 'buffer':
              console.log('HEYYO OUT BUFFER', data.toString('utf8'))
              data = new Entity(this.client).init?.(JSON.parse(data.toString('utf8')))
              break
          }
        }
        break
    }

    return data
  }
}
