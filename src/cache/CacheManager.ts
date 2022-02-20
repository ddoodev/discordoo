import { CachingPoliciesProcessor } from '@src/cache/CachingPoliciesProcessor'
import { IpcCacheOpCodes, IpcOpCodes, SerializeModes } from '@src/constants'
import { CacheProvider, CacheStorageKey } from '@discordoo/providers'
import { DiscordooError, resolveDiscordooShards, WebSocketUtils } from '@src/utils'
import { Client, ProviderConstructor } from '@src/core'
import { EntityKey } from '@src/api/entities'
import {
  IpcCacheClearRequestPacket,
  IpcCacheClearResponsePacket,
  IpcCacheCountRequestPacket,
  IpcCacheCountResponsePacket,
  IpcCacheCountsRequestPacket,
  IpcCacheCountsResponsePacket,
  IpcCacheDeleteRequestPacket,
  IpcCacheDeleteResponsePacket, IpcCacheEntriesRequestPacket, IpcCacheEntriesResponsePacket,
  IpcCacheFilterRequestPacket,
  IpcCacheFilterResponsePacket,
  IpcCacheFindRequestPacket,
  IpcCacheFindResponsePacket,
  IpcCacheForEachRequestPacket,
  IpcCacheForEachResponsePacket,
  IpcCacheGetRequestPacket,
  IpcCacheGetResponsePacket,
  IpcCacheHasRequestPacket,
  IpcCacheHasResponsePacket, IpcCacheKeysRequestPacket, IpcCacheKeysResponsePacket,
  IpcCacheMapRequestPacket,
  IpcCacheMapResponsePacket,
  IpcCacheSetRequestPacket,
  IpcCacheSetResponsePacket,
  IpcCacheSizeRequestPacket,
  IpcCacheSizeResponsePacket,
  IpcCacheSweepRequestPacket,
  IpcCacheSweepResponsePacket, IpcCacheValuesRequestPacket, IpcCacheValuesResponsePacket
} from '@src/sharding/interfaces/ipc/IpcPackets'
import {
  cacheProviderKeysPolyfill,
  cacheProviderClearPolyfill,
  cacheProviderCountPolyfill,
  cacheProviderCountsPolyfill,
  cacheProviderFilterPolyfill,
  cacheProviderFindPolyfill,
  cacheProviderHasPolyfill,
  cacheProviderMapPolyfill,
  cacheProviderSizePolyfill,
  cacheProviderSweepPolyfill, cacheProviderValuesPolyfill, cacheProviderEntriesPolyfill,
} from '@src/cache/polyfills'
import {
  CacheManagerClearOptions,
  CacheManagerCountOptions,
  CacheManagerCountsOptions,
  CacheManagerData,
  CacheManagerDeleteOptions, CacheManagerEntriesOptions,
  CacheManagerFilterOptions,
  CacheManagerFindOptions,
  CacheManagerForEachOptions,
  CacheManagerGetOptions,
  CacheManagerHasOptions, CacheManagerKeysOptions,
  CacheManagerMapOptions,
  CacheManagerSetOptions,
  CacheManagerSizeOptions,
  CacheManagerSweepOptions, CacheManagerValuesOptions,
  CacheOptions,
  CachePointer,
} from '@src/cache/interfaces'
import { EntitiesUtil } from '@src/api/entities/EntitiesUtil'
import { toJson } from '@src/utils/toJson'
import { isCachePointer } from '@src/utils/cachePointer'

export class CacheManager<P extends CacheProvider = CacheProvider> {
  public client: Client
  public provider: P

  private readonly _policiesProcessor: CachingPoliciesProcessor

  constructor(client: Client, Provider: ProviderConstructor<P>, data: CacheManagerData) {
    this.client = client
    this.provider = new Provider(this.client, data.cacheOptions, data.providerOptions)
    this._policiesProcessor = new CachingPoliciesProcessor(this.client)
  }

  async get<K = string, V = any>(
    keyspace: string,
    storage: CacheStorageKey,
    entityKey: EntityKey,
    key: K,
    options: CacheManagerGetOptions & { __ddcp?: boolean } = {}
  ): Promise<V | undefined> {
    let result: any

    if (this.isShardedRequest(options)) {
      const shards = resolveDiscordooShards(this.client, options.shard!)

      const request: IpcCacheGetRequestPacket = {
        op: IpcOpCodes.CACHE_OPERATE,
        d: {
          op: IpcCacheOpCodes.GET,
          event_id: this.client.internals.ipc.generate(),
          key,
          keyspace,
          storage: options?.storage ?? storage,
          entity_key: entityKey,
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
      result = await this.provider.get<K, V>(keyspace, options?.storage ?? storage, key)
    }

    const pointer = isCachePointer(result)

    if (pointer) {
      // __ddcp option means that previous value are cache pointer. cache pointer cannot point to another cache pointer.
      if (options.__ddcp) {
        // console.log('recursive cache pointer', pointer)
        return undefined
      }
      // console.log('get pointer', pointer)
      return this.get(pointer[0], pointer[1], entityKey, pointer[2], { ...options, storage: pointer[1], __ddcp: true })
    }

    result = await this._prepareData('out', result, entityKey)

    return result
  }

  async set<K = string, V = any>(
    keyspace: string,
    storage: CacheStorageKey,
    entityKey: EntityKey,
    policy: keyof CacheOptions = 'global',
    key: K,
    value: V | CachePointer,
    options: CacheManagerSetOptions = {}
  ): Promise<this> {
    if (typeof value !== 'object' && typeof value !== 'string'!) {
      throw new DiscordooError(
        'CacheManager#set',
        'Cache cannot operate with anything expect objects. Received',
        value === null ? 'null' : typeof value
      )
    }

    let limited = false, shouldClear = true

    /**
     * When entityKey is unknown or value is a cachePointer, do not apply cache policies.
     * When the global cache policy allows or does not allow writing, use only this value.
     * When the global cache policy is not in effect, use the specified cache policy.
     * If any cache policy prohibits writing, clear the existing cache.
     * */
    if (entityKey !== 'any') {
      const pointer = isCachePointer(value)

      if (pointer) {
        const allowed = await this.has(pointer[0], pointer[1], pointer[2])
        limited = !allowed
        shouldClear = limited
      } else {
        const globalAllowed = await this._policiesProcessor.global(value)
        if (globalAllowed !== undefined) {
          limited = !globalAllowed
        } else {
          limited = !(await this._policiesProcessor[policy](value))
        }
      }
    }

    if (limited) {
      if (shouldClear) await this.delete(keyspace, storage, key, options)
      return this
    }

    const data = await this._prepareData('in', value, entityKey, this.isShardedRequest(options))

    if (this.isShardedRequest(options)) {
      const shards = resolveDiscordooShards(this.client, options.shard!)

      const request: IpcCacheSetRequestPacket = {
        op: IpcOpCodes.CACHE_OPERATE,
        d: {
          op: IpcCacheOpCodes.SET,
          event_id: this.client.internals.ipc.generate(),
          key,
          keyspace,
          storage: options.storage ?? storage,
          entity_key: entityKey,
          shards,
          policy,
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
      await this.provider.set<K, V>(keyspace, options.storage ?? storage, key, data)
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
      const shards = resolveDiscordooShards(this.client, options.shard!)

      const request: IpcCacheDeleteRequestPacket = {
        op: IpcOpCodes.CACHE_OPERATE,
        d: {
          op: IpcCacheOpCodes.DELETE,
          event_id: this.client.internals.ipc.generate(),
          key,
          keyspace,
          storage: options?.storage ?? storage,
          shards,
          serialize: SerializeModes.BOOLEAN
        }
      }

      const { d: response } =
        await this.client.internals.ipc.send<IpcCacheDeleteResponsePacket>(request, { waitResponse: true })

      return response.success

    } else {
      return this.provider.delete<K>(keyspace, options?.storage ?? storage, key)
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
      const shards = resolveDiscordooShards(this.client, options.shard!)

      const request: IpcCacheForEachRequestPacket = {
        op: IpcOpCodes.CACHE_OPERATE,
        d: {
          op: IpcCacheOpCodes.FOREACH,
          event_id: this.client.internals.ipc.generate(),
          keyspace,
          storage: options?.storage ?? storage,
          entity_key: entityKey,
          shards,
          script: `(${predicate})`
        }
      }

      await this.client.internals.ipc.send<IpcCacheForEachResponsePacket>(request, { waitResponse: true })

    } else {
      await this.provider.forEach<K, V, P>(keyspace, options?.storage ?? storage, this._makePredicate(entityKey, predicate))
    }

    return undefined
  }

  async size(
    keyspace: string,
    storage: CacheStorageKey,
    options: CacheManagerSizeOptions = {}
  ): Promise<number> {
    let result = 0

    if (this.isShardedRequest(options)) {
      const shards = resolveDiscordooShards(this.client, options.shard!)

      const request: IpcCacheSizeRequestPacket = {
        op: IpcOpCodes.CACHE_OPERATE,
        d: {
          op: IpcCacheOpCodes.SIZE,
          event_id: this.client.internals.ipc.generate(),
          keyspace,
          storage: options?.storage ?? storage,
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
        result = await this.provider.size(keyspace, options?.storage ?? storage)
      } else {
        result = await cacheProviderSizePolyfill<P>(this.provider, keyspace, options?.storage ?? storage)
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

    if (this.isShardedRequest(options)) {
      const shards = resolveDiscordooShards(this.client, options.shard!)

      const request: IpcCacheHasRequestPacket = {
        op: IpcOpCodes.CACHE_OPERATE,
        d: {
          op: IpcCacheOpCodes.HAS,
          event_id: this.client.internals.ipc.generate(),
          keyspace,
          storage: options?.storage ?? storage,
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
        result = await this.provider.has<K>(keyspace, options?.storage ?? storage, key)
      } else {
        result = await cacheProviderHasPolyfill<K, P>(this.provider, keyspace, options?.storage ?? storage, key)
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
      const shards = resolveDiscordooShards(this.client, options.shard!)

      const request: IpcCacheSweepRequestPacket = {
        op: IpcOpCodes.CACHE_OPERATE,
        d: {
          op: IpcCacheOpCodes.SWEEP,
          event_id: this.client.internals.ipc.generate(),
          keyspace,
          storage: options?.storage ?? storage,
          entity_key: entityKey,
          shards,
          script: `(${predicate})`
        }
      }

      await this.client.internals.ipc.send<IpcCacheSweepResponsePacket>(request, { waitResponse: true })

    } else {

      if (this.provider.sweep) {
        await this.provider.sweep<K, V, P>(keyspace, options?.storage ?? storage, this._makePredicate(entityKey, predicate))
      } else {
        await cacheProviderSweepPolyfill<K, V, P>(
          this.provider, keyspace, options?.storage ?? storage, this._makePredicate(entityKey, predicate)
        )
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
      const shards = resolveDiscordooShards(this.client, options.shard!)

      const request: IpcCacheFilterRequestPacket = {
        op: IpcOpCodes.CACHE_OPERATE,
        d: {
          op: IpcCacheOpCodes.FILTER,
          event_id: this.client.internals.ipc.generate(),
          keyspace,
          storage: options?.storage ?? storage,
          entity_key: entityKey,
          shards,
          script: `(${predicate})`,
          serialize: SerializeModes.ARRAY
        }
      }

      const { d: response } =
        await this.client.internals.ipc.send<IpcCacheFilterResponsePacket>(request, { waitResponse: true })

      if (response.success) {
        result = await Promise.all(response.result.map(this._makePredicate(entityKey, (v, k) => ([ k, v ]))))
      }

    } else {

      if (this.provider.filter) {
        result = await this.provider.filter<K, V, P>(
          keyspace, options?.storage ?? storage, this._makePredicate(entityKey, predicate)
        )
      } else {
        result = await cacheProviderFilterPolyfill<K, V, P>(
          this.provider, keyspace, options?.storage ?? storage, this._makePredicate(entityKey, predicate)
        )
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
      const shards = resolveDiscordooShards(this.client, options.shard!)

      const request: IpcCacheMapRequestPacket = {
        op: IpcOpCodes.CACHE_OPERATE,
        d: {
          op: IpcCacheOpCodes.MAP,
          event_id: this.client.internals.ipc.generate(),
          keyspace,
          storage: options?.storage ?? storage,
          entity_key: entityKey,
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
        result = await this.provider.map<K, V, R, P>(
          keyspace, options?.storage ?? storage, this._makePredicate(entityKey, predicate)
        )
      } else {
        result = await cacheProviderMapPolyfill<K, V, R, P>(
          this.provider, keyspace, options?.storage ?? storage, this._makePredicate(entityKey, predicate)
        )
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
      const shards = resolveDiscordooShards(this.client, options.shard!)

      const request: IpcCacheFindRequestPacket = {
        op: IpcOpCodes.CACHE_OPERATE,
        d: {
          op: IpcCacheOpCodes.FIND,
          event_id: this.client.internals.ipc.generate(),
          keyspace,
          storage: options?.storage ?? storage,
          entity_key: entityKey,
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
        result = await this.provider.find<K, V, P>
        (keyspace, options?.storage ?? storage, this._makePredicate(entityKey, predicate)
        )
      } else {
        result = await cacheProviderFindPolyfill<K, V, P>(
          this.provider, keyspace, options?.storage ?? storage, this._makePredicate(entityKey, predicate)
        )
      }

    }

    result = await this._prepareData('out', result, entityKey)

    return result
  }

  async clear(
    keyspace: string,
    storage: CacheStorageKey,
    options: CacheManagerClearOptions = {}
  ): Promise<boolean> {
    if (this.isShardedRequest(options)) {
      const shards = resolveDiscordooShards(this.client, options.shard!)

      const request: IpcCacheClearRequestPacket = {
        op: IpcOpCodes.CACHE_OPERATE,
        d: {
          op: IpcCacheOpCodes.CLEAR,
          event_id: this.client.internals.ipc.generate(),
          keyspace,
          storage: options?.storage ?? storage,
          shards,
          serialize: SerializeModes.BOOLEAN
        }
      }

      const { d: response } =
        await this.client.internals.ipc.send<IpcCacheClearResponsePacket>(request, { waitResponse: true })

      return response.success

    } else {

      if (this.provider.clear) {
        return this.provider.clear(keyspace, options?.storage ?? storage)
      } else {
        return cacheProviderClearPolyfill<P>(this.provider, keyspace, options?.storage ?? storage)
      }

    }
  }

  async count<K = string, V = any>(
    keyspace: string,
    storage: CacheStorageKey,
    entityKey: EntityKey,
    predicate: (value: V, key: K, provider: P) => (boolean | Promise<boolean>),
    options: CacheManagerCountOptions = {}
  ): Promise<number> {
    let result = 0

    if (this.isShardedRequest(options)) {
      const shards = resolveDiscordooShards(this.client, options.shard!)

      const request: IpcCacheCountRequestPacket = {
        op: IpcOpCodes.CACHE_OPERATE,
        d: {
          op: IpcCacheOpCodes.COUNT,
          event_id: this.client.internals.ipc.generate(),
          keyspace,
          storage: options?.storage ?? storage,
          entity_key: entityKey,
          shards,
          script: `(${predicate})`,
          serialize: SerializeModes.NUMBER
        }
      }

      const { d: response } =
        await this.client.internals.ipc.send<IpcCacheCountResponsePacket>(request, { waitResponse: true })

      if (response.success) {
        result = response.result
      }

    } else {

      if (this.provider.count) {
        result = await this.provider.count<K, V, P>(
          keyspace, options?.storage ?? storage, this._makePredicate(entityKey, predicate)
        )
      } else {
        result = await cacheProviderCountPolyfill<K, V, P>(
          this.provider, keyspace, options?.storage ?? storage, this._makePredicate(entityKey, predicate)
        )
      }

    }

    return result
  }

  async counts<K = string, V = any>(
    keyspace: string,
    storage: CacheStorageKey,
    entityKey: EntityKey,
    predicates: ((value: V, key: K, provider: P) => (boolean | Promise<boolean>))[],
    options: CacheManagerCountsOptions = {}
  ): Promise<number[]> {
    let results: number[] = []

    if (this.isShardedRequest(options)) {
      const shards = resolveDiscordooShards(this.client, options.shard!)

      const request: IpcCacheCountsRequestPacket = {
        op: IpcOpCodes.CACHE_OPERATE,
        d: {
          op: IpcCacheOpCodes.COUNTS,
          event_id: this.client.internals.ipc.generate(),
          keyspace,
          storage: options?.storage ?? storage,
          entity_key: entityKey,
          shards,
          scripts: predicates.map(p => (`(${p})`)),
          serialize: SerializeModes.NUMBERS_ARRAY
        }
      }

      const { d: response } =
        await this.client.internals.ipc.send<IpcCacheCountsResponsePacket>(request, { waitResponse: true })

      if (response.success) {
        results = response.result
      }

    } else {

      if (this.provider.counts) {
        results = await this.provider.counts<K, V, P>(
          keyspace, options?.storage ?? storage, predicates.map(p => this._makePredicate(entityKey, p))
        )
      } else {
        results = await cacheProviderCountsPolyfill<K, V, P>(
          this.provider, keyspace, options?.storage ?? storage, predicates.map(p => this._makePredicate(entityKey, p))
        )
      }

    }

    return results
  }

  async keys<K = string>(
    keyspace: string,
    storage: CacheStorageKey,
    entityKey: EntityKey,
    options: CacheManagerKeysOptions = {}
  ): Promise<K[]> {
    if (this.isShardedRequest(options)) {
      const shards = resolveDiscordooShards(this.client, options.shard!)

      const request: IpcCacheKeysRequestPacket = {
        op: IpcOpCodes.CACHE_OPERATE,
        d: {
          op: IpcCacheOpCodes.KEYS,
          event_id: this.client.internals.ipc.generate(),
          keyspace,
          storage: options?.storage ?? storage,
          shards,
          serialize: SerializeModes.ARRAY,
          entity_key: entityKey,
        }
      }

      const { d: response } =
        await this.client.internals.ipc.send<IpcCacheKeysResponsePacket>(request, { waitResponse: true })

      return response.result

    } else {

      if (this.provider.keys) {
        return this.provider.keys(keyspace, options?.storage ?? storage)
      } else {
        return cacheProviderKeysPolyfill<K, P>(this.provider, keyspace, options?.storage ?? storage)
      }

    }
  }

  async values<V = any>(
    keyspace: string,
    storage: CacheStorageKey,
    entityKey: EntityKey,
    options: CacheManagerValuesOptions = {}
  ): Promise<V[]> {
    if (this.isShardedRequest(options)) {
      const shards = resolveDiscordooShards(this.client, options.shard!)

      const request: IpcCacheValuesRequestPacket = {
        op: IpcOpCodes.CACHE_OPERATE,
        d: {
          op: IpcCacheOpCodes.VALUES,
          event_id: this.client.internals.ipc.generate(),
          keyspace,
          storage: options?.storage ?? storage,
          shards,
          serialize: SerializeModes.ARRAY,
          entity_key: entityKey,
        }
      }

      const { d: response } =
        await this.client.internals.ipc.send<IpcCacheValuesResponsePacket>(request, { waitResponse: true })

      return response.result

    } else {

      if (this.provider.values) {
        return this.provider.values(keyspace, options?.storage ?? storage)
      } else {
        return cacheProviderValuesPolyfill<V, P>(this.provider, keyspace, options?.storage ?? storage)
      }

    }
  }

  async entries<K = string, V = any>(
    keyspace: string,
    storage: CacheStorageKey,
    entityKey: EntityKey,
    options: CacheManagerEntriesOptions = {}
  ): Promise<Array<[ K, V ]>> {
    if (this.isShardedRequest(options)) {
      const shards = resolveDiscordooShards(this.client, options.shard!)

      const request: IpcCacheEntriesRequestPacket = {
        op: IpcOpCodes.CACHE_OPERATE,
        d: {
          op: IpcCacheOpCodes.ENTRIES,
          event_id: this.client.internals.ipc.generate(),
          keyspace,
          storage: options?.storage ?? storage,
          shards,
          serialize: SerializeModes.ARRAY,
          entity_key: entityKey,
        }
      }

      const { d: response } =
        await this.client.internals.ipc.send<IpcCacheEntriesResponsePacket>(request, { waitResponse: true })

      return response.result

    } else {

      if (this.provider.entries) {
        return this.provider.entries(keyspace, options?.storage ?? storage)
      } else {
        return cacheProviderEntriesPolyfill<K, V, P>(this.provider, keyspace, options?.storage ?? storage)
      }

    }
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

    if (forIpcRequest) return toJson(data)

    if (direction === 'in') {
      const pointer = isCachePointer(data)

      if (pointer || entityKey === 'any') {
        switch (this.provider.compatible) {
          case 'classes':
          case 'json':
            return toJson(data)
          case 'text':
            return toJson(data, true)
          case 'buffer':
            return Buffer.from(toJson(data, true))
        }
      }

      const Entity: any = EntitiesUtil.get(entityKey, data)

      switch (this.provider.compatible) {
        case 'classes':
          if (!(data instanceof Entity)) data = await new Entity(this.client).init?.(data)
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

      return data
    } else if (direction === 'out') {
      let jsonOrEntity: any

      switch (this.provider.compatible) {
        case 'classes':
        case 'json':
          jsonOrEntity = data
          break
        case 'text':
          jsonOrEntity = data ? JSON.parse(data) : data
          break
        case 'buffer':
          jsonOrEntity = data ? JSON.parse(data.toString('utf8')) : data
          break
      }

      const pointer = isCachePointer(jsonOrEntity)

      if (pointer) {
        return await this.get(pointer[0], pointer[1], entityKey, pointer[2])
      }

      if (entityKey === 'any') {
        return jsonOrEntity
      }

      if (jsonOrEntity) {
        const Entity: any = EntitiesUtil.get(entityKey, jsonOrEntity)

        if (!(jsonOrEntity instanceof Entity)) jsonOrEntity = await new Entity(this.client).init?.(jsonOrEntity)
      }

      return jsonOrEntity
    }
  }
}
