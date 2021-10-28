// TODO: (╯°□°）╯︵ ┻━┻
import { DiscordooProviders, GlobalCachingPolicy, IpcEvents, IpcOpCodes, REST_DEFAULT_OPTIONS, WS_DEFAULT_OPTIONS } from '@src/constants'
import { DiscordooError, DiscordooSnowflake, ReplaceType, resolveDiscordShards, ShardListResolvable, version } from '@src/utils'
import { CompletedLocalIpcOptions } from '@src/constants/sharding/CompletedLocalIpcOptions'
import { CompletedGatewayOptions } from '@src/gateway/interfaces/CompletedGatewayOptions'
import { ClientMessagesManager } from '@src/api/managers/messages/ClientMessagesManager'
import { ClientChannelsManager } from '@src/api/managers/channels/ClientChannelsManager'
import { ClientStickersManager } from '@src/api/managers/stickers/ClientStickersManager'
import { LOCAL_IPC_DEFAULT_OPTIONS } from '@src/constants/sharding/IpcDefaultOptions'
import { ClientMembersManager } from '@src/api/managers/members/ClientMembersManager'
import { CompletedCacheOptions } from '@src/cache/interfaces/CompletedCacheOptions'
import { ClientShardingMetadata } from '@src/core/client/ClientShardingMetadata'
import { CompletedRestOptions } from '@src/rest/interfaces/CompletedRestOptions'
import { CACHE_OPTIONS_KEYS_LENGTH } from '@src/cache/interfaces/CacheOptions'
import { ProviderConstructor } from '@src/core/providers/ProviderConstructor'
import { DefaultGatewayProvider } from '@src/gateway/DefaultGatewayProvider'
import { DefaultClientStack } from '@src/core/client/DefaultClientStack'
import { DefaultCacheProvider } from '@src/cache/DefaultCacheProvider'
import { ListenerSignature, TypedEmitter } from 'tiny-typed-emitter'
import { DefaultRestProvider } from '@src/rest/DefaultRestProvider'
import { ClientInternals } from '@src/core/client/ClientInternals'
import { ClientMetadata } from '@src/core/client/ClientMetadata'
import { ClientOptions } from '@src/core/client/ClientOptions'
import { ClientActions } from '@src/core/client/ClientActions'
import { ClientEvents, MessageCreateEvent } from '@src/events'
import { UsersManager } from '@src/api/managers/UsersManager'
import { ClientRolesManager } from '@src/api/managers/roles'
import { GatewayManager } from '@src/gateway/GatewayManager'
import { GatewayShardsInfo } from '@discordoo/providers'
import { IpcServer } from '@src/sharding/ipc/IpcServer'
import { CacheManager } from '@src/cache/CacheManager'
import { RestManager } from '@src/rest/RestManager'
import { GuildsManager } from '@src/api/managers'
import { Final } from '@src/utils/FinalDecorator'
import { IpcServerOptions } from '@src/sharding'
import { EntitiesUtil } from '@src/api'
import { ClientPresencesManager } from '@src/api/managers/presences'
import { ClientReactionsManager } from '@src/api/managers/reactions/ClientReactionsManager'
import { ClientPermissionsOverwritesManager } from '@src/api/managers/overwrites/ClientPermissionsOverwritesManager'

/** Entry point for all of Discordoo. */
@Final(
  'start',
  'internals',
  'guilds',
  'users',
  'messages',
  'channels',
  'stickers',
  'members',
  'roles',
  'presences',
  'reactions',
  'overwrites',
  'token',
)
export class Client<ClientStack extends DefaultClientStack = DefaultClientStack>
  extends TypedEmitter<ListenerSignature<ClientStack['events']>> { // TODO: events does not auto-typed
  /** Token used by this client */
  public token: string

  /** Internal things used by this client */
  public internals: ClientInternals<ClientStack>

  /** Options passed to this client */
  public options: ClientOptions

  /** Guilds manager of this client */
  public guilds: GuildsManager

  /** Users manager of this client */
  public users: UsersManager

  /** Messages manager of this client */
  public messages: ClientMessagesManager

  /** Channels manager of this client */
  public channels: ClientChannelsManager

  /** Stickers manager of this client */
  public stickers: ClientStickersManager

  /** Members manager of this client */
  public members: ClientMembersManager

  /** Roles manager of this client */
  public roles: ClientRolesManager

  /** Presences manager of this client */
  public presences: ClientPresencesManager

  /** Reactions manager of this client */
  public reactions: ClientReactionsManager

  /** Permissions Overwrites manager of this client */
  public overwrites: ClientPermissionsOverwritesManager

  #running = false

  constructor(token: string, options: ClientOptions = {}) {
    super()

    options.extenders?.forEach(extender => {
      EntitiesUtil.extend(extender.entity, extender.extender)
    })

    this.token = token
    this.options = options

    const gatewayOptions: CompletedGatewayOptions = this._makeGatewayOptions()
    const restOptions: CompletedRestOptions = this._makeRestOptions()
    const cacheOptions: CompletedCacheOptions = this._makeCacheOptions()
    const ipcOptions: CompletedLocalIpcOptions = this._makeLocalIpcOptions()

    let restProvider: ProviderConstructor<ClientStack['rest']> = DefaultRestProvider
    let cacheProvider: ProviderConstructor<ClientStack['cache']> = DefaultCacheProvider
    let gatewayProvider: ProviderConstructor<ClientStack['gateway']> = DefaultGatewayProvider
    let restProviderOptions, gatewayProviderOptions, cacheProviderOptions

    const MANAGER_IPC = process.env.SHARDING_MANAGER_IPC ?? DiscordooSnowflake.generatePartial()
    const INSTANCE_IPC = process.env.SHARDING_INSTANCE_IPC ?? DiscordooSnowflake.generatePartial()

    this.options.providers?.forEach(provider => {
      try {
        switch (provider.provide) {
          case DiscordooProviders.CACHE:
            cacheProvider = provider.useClass
            cacheProviderOptions = provider.useOptions
            break

          case DiscordooProviders.GATEWAY:
            gatewayProvider = provider.useClass
            gatewayProviderOptions = provider.useOptions
            break

          case DiscordooProviders.REST:
            restProvider = provider.useClass
            restProviderOptions = provider.useOptions
            break
        }
      } catch (e) {
        throw new DiscordooError('Client#constructor', 'one of providers threw error when initialized:', e)
      }
    })

    const shardingMetadata: ClientShardingMetadata = {
      MANAGER_IPC,
      INSTANCE_IPC,
      instance: parseInt(process.env.SHARDING_INSTANCE ?? '0'),
      shards: gatewayOptions.shards,
      totalShards: gatewayOptions.totalShards,
      active: DiscordooSnowflake.deconstruct(MANAGER_IPC).shardId === DiscordooSnowflake.SHARDING_MANAGER_ID,
    }

    const rest = new RestManager<ClientStack['rest']>(
      this,
      restProvider,
      { restOptions, providerOptions: restProviderOptions }
    )

    const cache = new CacheManager<ClientStack['cache']>(
      this,
      cacheProvider,
      { cacheOptions, providerOptions: cacheProviderOptions }
    )

    const gateway = new GatewayManager<ClientStack['gateway']>(
      this,
      gatewayProvider,
      { gatewayOptions, providerOptions: gatewayProviderOptions }
    )

    const ipc = new IpcServer(
      this,
      this._makeIpcServerOptions(ipcOptions, shardingMetadata)
    )

    const allCacheDisabled = (() => {
      if (this.options.cache?.global?.policies.includes(GlobalCachingPolicy.NONE)) return true

      const options = Object.entries(this.options.cache ?? {})
      const total = options.length, defaultTotal = CACHE_OPTIONS_KEYS_LENGTH
      if (total === 0 || total < defaultTotal) return false

      let disabled = 0

      for (const [ policy ] of options) {
        if (policy.includes('none')) disabled++
      }

      return defaultTotal === disabled
    })()

    const clientMetadata: ClientMetadata = {
      version,
      shardingUsed: shardingMetadata.active,
      restRateLimitsDisabled: restOptions.rateLimits.disable === true,
      restVersion: restOptions.version,
      gatewayVersion: gatewayOptions.version,
      allCacheDisabled,
      machinesShardingUsed: false // not supported yet
    }

    const actions = new ClientActions(this), events = new ClientEvents(this)

    this.internals = {
      rest,
      cache,
      gateway,
      sharding: shardingMetadata,
      ipc,
      actions,
      events,
      metadata: clientMetadata,
    }

    this.internals.events.register([ MessageCreateEvent ]) // TODO

    this.overwrites = new ClientPermissionsOverwritesManager(this)
    this.presences = new ClientPresencesManager(this)
    this.reactions = new ClientReactionsManager(this)
    this.messages = new ClientMessagesManager(this)
    this.channels = new ClientChannelsManager(this)
    this.stickers = new ClientStickersManager(this)
    this.members = new ClientMembersManager(this)
    this.roles = new ClientRolesManager(this)
    this.guilds = new GuildsManager(this)
    this.users = new UsersManager(this)
  }

  async start(): Promise<Client<ClientStack>> {
    if (this.#running) throw new DiscordooError('Client#start', 'Client already running.')
    this.#running = true

    let options: GatewayShardsInfo | undefined

    if (this.internals.sharding.active) {
      // sharding manager sends to us sharding information (shards - array of shards to serve)
      const { d: { shards, total_shards: totalShards } } = await this.internals.ipc.serve()

      this.internals.sharding.shards = shards
      this.internals.sharding.totalShards = totalShards

      options = {
        shards,
        totalShards,
      }
    }

    await this.internals.gateway.init()
    await this.internals.cache.init()
    await this.internals.rest.init()

    return this.internals.gateway.connect(options)
      .then(async () => {
        if (this.internals.sharding.active) await this.internals.ipc.send({
          op: IpcOpCodes.DISPATCH,
          t: IpcEvents.CONNECTED,
          d: {
            event_id: this.internals.sharding.INSTANCE_IPC,
          }
        })

        return this
      })
      .catch(async e => {
        if (this.internals.sharding.active) await this.internals.ipc.send({
          op: IpcOpCodes.ERROR,
          d: {
            event_id: this.internals.sharding.INSTANCE_IPC,
            error: e
          }
        })

        throw e
      })
  }

  private _makeGatewayOptions(): CompletedGatewayOptions {
    const options: ReplaceType<CompletedGatewayOptions, 'shards', ShardListResolvable> =
      Object.assign(
        {},
        WS_DEFAULT_OPTIONS,
        { token: this.token },
        this.options.gateway
      )

    const shards = resolveDiscordShards(options.shards)
    const totalShards = shards.length

    return {
      ...options,
      shards,
      totalShards,
    }
  }

  private _makeRestOptions(): CompletedRestOptions {
    return Object.assign(
      {},
      REST_DEFAULT_OPTIONS,
      { auth: `Bot ${this.token}` },
      this.options.rest
    )
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

  private _makeIpcServerOptions(completedOptions: CompletedLocalIpcOptions, metadata: ClientShardingMetadata): IpcServerOptions {
    const { MANAGER_IPC, INSTANCE_IPC, instance } = metadata
    return Object.assign(
      {},
      { MANAGER_IPC, INSTANCE_IPC, instance },
      { config: completedOptions }
    )
  }
}
