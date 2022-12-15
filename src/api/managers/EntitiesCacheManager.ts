import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { DiscordApplication } from '@src/core'
import { EntityKey } from '@src/api/entities/interfaces'
import { EntitiesCacheManagerData } from '@src/api/managers/interfaces'
import {
  CacheManagerForEachOptions,
  CacheManagerDeleteOptions,
  CacheManagerFilterOptions,
  CacheManagerCountsOptions,
  CacheManagerSweepOptions,
  CacheManagerCountOptions,
  CacheManagerClearOptions,
  CacheManagerSizeOptions,
  CacheManagerFindOptions,
  CacheManagerGetOptions,
  CacheManagerHasOptions,
  CacheManagerMapOptions,
  CacheManagerSetOptions,
  CacheOptions, CachePointer,
  CacheManagerKeysOptions,
  CacheManagerValuesOptions,
  CacheManagerEntriesOptions,
} from '@src/cache/interfaces'
import { CacheProvider, CacheStorageKey } from '@discordoo/providers'

export class EntitiesCacheManager<DefaultEntity> extends EntitiesManager {
  private readonly entityKey: EntityKey
  private readonly policy: keyof CacheOptions
  public readonly keyspace: string
  public readonly storage: CacheStorageKey

  constructor(app: DiscordApplication, data: EntitiesCacheManagerData) {
    super(app)
    this.entityKey = data.entity
    this.keyspace = data.keyspace
    this.storage = data.storage
    this.policy = data.policy ?? 'global'
  }

  async delete(key: string[] | string, options?: CacheManagerDeleteOptions): Promise<boolean> {
    return this.app.internals.cache.delete<string>(this.keyspace, this.storage, key, options)
  }

  async filter<Entity extends DefaultEntity>(
    predicate: (value: Entity, key: string, provider: CacheProvider) => (boolean | Promise<boolean>),
    options?: CacheManagerFilterOptions
  ): Promise<Array<[ string, Entity ]>> {
    return this.app.internals.cache.filter<string, Entity>(
      this.keyspace,
      this.storage,
      this.entityKey,
      predicate,
      options,
    )
  }

  async find<Entity extends DefaultEntity>(
    predicate: (value: Entity, key: string, provider: CacheProvider) => (boolean | Promise<boolean>),
    options?: CacheManagerFindOptions
  ): Promise<Entity | undefined> {
    return this.app.internals.cache.find<string, Entity>(
      this.keyspace,
      this.storage,
      this.entityKey,
      predicate,
      options,
    )
  }

  async forEach<Entity extends DefaultEntity>(
    predicate: (value: Entity, key: string, provider: CacheProvider) => (unknown | Promise<unknown>),
    options?: CacheManagerForEachOptions
  ): Promise<void> {
    return this.app.internals.cache.forEach<string, Entity>(
      this.keyspace,
      this.storage,
      this.entityKey,
      predicate,
      options,
    )
  }

  async get<T extends DefaultEntity>(key: string, options?: CacheManagerGetOptions): Promise<T | undefined> {
    return this.app.internals.cache.get<string, T>(
      this.keyspace,
      this.storage,
      this.entityKey,
      key,
      options,
    )
  }

  async has(key: string, options?: CacheManagerHasOptions): Promise<boolean> {
    return this.app.internals.cache.has<string>(
      this.keyspace,
      this.storage,
      key,
      options,
    )
  }

  async map<R, Entity extends DefaultEntity>(
    predicate: (value: Entity, key: string, provider: CacheProvider) => (R | Promise<R>),
    options?: CacheManagerMapOptions
  ): Promise<R[]> {
    return this.app.internals.cache.map<string, Entity, R>(
      this.keyspace,
      this.storage,
      this.entityKey,
      predicate,
      options,
    )
  }

  async set<Entity extends DefaultEntity>(
    key: string, value: Entity | CachePointer, options?: CacheManagerSetOptions
  ): Promise<EntitiesCacheManager<Entity>> {
    await this.app.internals.cache.set<string, Entity>(
      this.keyspace,
      this.storage,
      this.entityKey,
      this.policy,
      key,
      value,
      options,
    )

    return this
  }

  async size(options?: CacheManagerSizeOptions): Promise<number> {
    return this.app.internals.cache.size(this.keyspace, this.storage, options)
  }

  async sweep<Entity extends DefaultEntity>(
    predicate: (value: Entity, key: string, provider: CacheProvider) => (boolean | Promise<boolean>),
    options?: CacheManagerSweepOptions
  ): Promise<void> {
    return this.app.internals.cache.sweep<string, Entity>(
      this.keyspace,
      this.storage,
      this.entityKey,
      predicate,
      options,
    )
  }

  async clear(options?: CacheManagerClearOptions): Promise<boolean> {
    return this.app.internals.cache.clear(this.keyspace, this.storage, options)
  }

  async count<Entity extends DefaultEntity>(
    predicate: (value: Entity, key: string, provider: CacheProvider) => (boolean | Promise<boolean>),
    options?: CacheManagerCountOptions
  ): Promise<number> {
    return this.app.internals.cache.count<string, Entity>(this.keyspace, this.storage, this.entityKey, predicate, options)
  }

  async counts<Entity extends DefaultEntity>(
    predicates: ((value: Entity, key: string, provider: CacheProvider) => (boolean | Promise<boolean>))[],
    options?: CacheManagerCountsOptions
  ): Promise<number[]> {
    return this.app.internals.cache.counts<string, Entity>(this.keyspace, this.storage, this.entityKey, predicates, options)
  }

  async keys(options?: CacheManagerKeysOptions): Promise<string[]> {
    return this.app.internals.cache.keys<string>(this.keyspace, this.storage, this.entityKey, options)
  }

  async values<Entity extends DefaultEntity>(options?: CacheManagerValuesOptions): Promise<Entity[]> {
    return this.app.internals.cache.values<Entity>(this.keyspace, this.storage, this.entityKey, options)
  }

  async entries<Entity extends DefaultEntity>(options?: CacheManagerEntriesOptions): Promise<Array<[ string, Entity ]>> {
    return this.app.internals.cache.entries<string, Entity>(this.keyspace, this.storage, this.entityKey, options)
  }
}
