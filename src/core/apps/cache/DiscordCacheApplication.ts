import { TypedEmitter } from 'tiny-typed-emitter'
import { CompletedLocalIpcOptions, IpcServerOptions, LocalIpcServer } from '../../../../src/sharding'
import {
  ApplicationShardingMetadata,
  CacheApplicationInternals,
  CacheApplicationMetadata,
  CacheApplicationOptions, CompletedCacheApplicationOptions, DefaultCacheApplicationStack,
  ProviderConstructor
} from '../../../../src/core'
import { LOCAL_IPC_DEFAULT_OPTIONS } from '../../../../src/constants/sharding/IpcDefaultOptions'
import { ApplicationEvents } from '../../../../src/events'
import { DiscordooProviders, GlobalCachingPolicy } from '../../../../src/constants'
import { EntitiesUtil } from '../../../../src/api'
import { DiscordooError, DiscordooSnowflake, version } from '../../../../src/utils'
import { CACHE_OPTIONS_KEYS_LENGTH } from '../../../../src/cache/interfaces/CacheOptions'
import { CacheManager, CompletedCacheOptions, DefaultCacheProvider } from '../../../../src/cache'

export class DiscordCacheApplication<Stack extends DefaultCacheApplicationStack = DefaultCacheApplicationStack>
  // @ts-ignore because events can be redefined, and the typed emitter library doesn't like it. it works anyway.
  extends TypedEmitter<Stack['events']> {

  /** Token used by this app */
  public readonly token: string

  /** Internal things used by this app */
  public readonly internals: CacheApplicationInternals<Stack>

  /** Options passed to this app */
  public readonly options: CacheApplicationOptions

  protected running = false

  constructor(token: string, options: CacheApplicationOptions = {}) {
    super()

    options.extenders?.forEach(e => {
      EntitiesUtil.extend(e.entity, e.extender)
    })

    this.token = token
    this.options = options

    const cacheOptions: CompletedCacheOptions = this._makeCacheOptions()
    const ipcOptions: CompletedLocalIpcOptions = this._makeLocalIpcOptions()

    const appOptions: CompletedCacheApplicationOptions = {
      cache: cacheOptions,
      ipc: ipcOptions
    }

    let cacheProvider: ProviderConstructor<Stack['cache']> = DefaultCacheProvider, cacheProviderOptions

    const MANAGER_IPC = process.env.SHARDING_MANAGER_IPC ?? DiscordooSnowflake.generatePartial()
    const INSTANCE_IPC = process.env.SHARDING_INSTANCE_IPC ?? DiscordooSnowflake.generatePartial()

    this.options.providers?.forEach(provider => {
      try {
        switch (provider.provide) {
          case DiscordooProviders.Cache:
            cacheProvider = provider.useClass
            cacheProviderOptions = provider.useOptions
            break
        }
      } catch (e) {
        throw new DiscordooError('DiscordApplication#constructor', 'cache provider threw init error:', e)
      }
    })

    const shardingMetadata: ApplicationShardingMetadata = {
      MANAGER_IPC,
      INSTANCE_IPC,
      instance: parseInt(process.env.SHARDING_INSTANCE ?? '0'),
      shards: process.env.SHARDING_SHARDS?.split(',').map(s => parseInt(s)) ?? [ 0 ],
      totalShards: parseInt(process.env.SHARDING_TOTAL ?? '1'),
      active: DiscordooSnowflake.deconstruct(MANAGER_IPC).shardId === DiscordooSnowflake.SHARDING_MANAGER_ID,
    }

    const cache = new CacheManager<Stack['cache']>(
      this,
      cacheProvider,
      { cacheOptions, providerOptions: cacheProviderOptions }
    )
    const ipc = new LocalIpcServer(
      this,
      this._makeIpcServerOptions(ipcOptions, shardingMetadata)
    )

    const allCacheDisabled = (() => {
      if (options.cache?.global?.policies.includes(GlobalCachingPolicy.None)) return true

      const opts = Object.entries(this.options.cache ?? {})
      const total = opts.length, defaultTotal = CACHE_OPTIONS_KEYS_LENGTH
      if (total === 0 || total < defaultTotal) return false

      let disabled = 0

      for (const [ policy ] of opts) {
        if (policy.includes('none')) disabled++
      }

      return defaultTotal === disabled
    })()

    const events = new ApplicationEvents(this)
    const appMetadata: CacheApplicationMetadata = {
      version,
      shardingUsed: shardingMetadata.active,
      allCacheDisabled,
      machinesShardingUsed: false // not supported yet
    }

    this.internals = {
      ipc,
      cache,
      metadata: appMetadata,
      sharding: shardingMetadata,
      events,
      options: appOptions
    }
  }

  public async start(): Promise<DiscordCacheApplication<Stack>>  {
    if (this.running) throw new DiscordooError('DiscordApplication#start', 'Already running.')
    this.running = true

    await this.internals.cache.init()

    return this
  }

  private _makeCacheOptions(): CompletedCacheOptions {
    return this.options.cache ?? {}
  }

  private _makeLocalIpcOptions(): CompletedLocalIpcOptions {
    return Object.assign(
      {},
      LOCAL_IPC_DEFAULT_OPTIONS,
      this.options.ipc
    )
  }

  private _makeIpcServerOptions(completedOptions: CompletedLocalIpcOptions, metadata: ApplicationShardingMetadata): IpcServerOptions {
    const { MANAGER_IPC, INSTANCE_IPC, instance } = metadata
    return Object.assign(
      {},
      { MANAGER_IPC, INSTANCE_IPC, instance },
      { config: completedOptions }
    )
  }

  protected get getInternals(): CacheApplicationInternals<Stack> {
    return this.internals
  }
}