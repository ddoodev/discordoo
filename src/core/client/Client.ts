// TODO: (╯°□°）╯︵ ┻━┻
import {
  DiscordooProviders,
  EventNames,
  GlobalCachingPolicy,
  IpcEvents,
  IpcOpCodes,
  REST_DEFAULT_OPTIONS,
  WS_DEFAULT_OPTIONS
} from '@src/constants'
import { DiscordooError, DiscordooSnowflake, ReplaceType, resolveDiscordShards, ShardListResolvable, version, wait } from '@src/utils'
import { CompletedLocalIpcOptions } from '@src/constants/sharding/CompletedLocalIpcOptions'
import { CompletedGatewayOptions } from '@src/gateway/interfaces/CompletedGatewayOptions'
import { ClientMessagesManager } from '@src/api/managers/messages/ClientMessagesManager'
import { ClientChannelsManager } from '@src/api/managers/channels/ClientChannelsManager'
import { ClientStickersManager } from '@src/api/managers/stickers/ClientStickersManager'
import { LOCAL_IPC_DEFAULT_OPTIONS } from '@src/constants/sharding/IpcDefaultOptions'
import { ClientGuildMembersManager } from '@src/api/managers/members/ClientGuildMembersManager'
import { CompletedCacheOptions } from '@src/cache/interfaces/CompletedCacheOptions'
import { ClientShardingMetadata } from '@src/core/client/ClientShardingMetadata'
import { CompletedRestOptions } from '@src/rest/interfaces/CompletedRestOptions'
import { CACHE_OPTIONS_KEYS_LENGTH } from '@src/cache/interfaces/CacheOptions'
import { ProviderConstructor } from '@src/core/providers/ProviderConstructor'
import { DefaultGatewayProvider } from '@src/gateway/DefaultGatewayProvider'
import { DefaultClientStack } from '@src/core/client/DefaultClientStack'
import { DefaultCacheProvider } from '@src/cache/DefaultCacheProvider'
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
import { LocalIpcServer } from '@src/sharding/ipc/LocalIpcServer'
import { CacheManager } from '@src/cache/CacheManager'
import { RestManager } from '@src/rest/RestManager'
import { TypedEmitter } from 'tiny-typed-emitter'
import { GuildsManager } from '@src/api/managers'
import { Final } from '@src/utils/FinalDecorator'
import { IpcServerOptions } from '@src/sharding'
import { EntitiesUtil } from '@src/api/entities/EntitiesUtil'
import { ClientPresencesManager } from '@src/api/managers/presences'
import { ClientReactionsManager } from '@src/api/managers/reactions/ClientReactionsManager'
import { ClientPermissionOverwritesManager } from '@src/api/managers/overwrites/ClientPermissionOverwritesManager'
import { GuildCreateEvent } from '@src/events/GuildCreateEvent'
import { PresenceUpdateEvent } from '@src/events/PresenceUpdateEvent'
import { ClientQueues } from '@src/core/client/ClientQueues'
import { Collection } from '@discordoo/collection'
import { OtherCacheManager } from '@src/api/managers/OtherCacheManager'
import { otherCacheSymbol } from '@src/constants'
import { ClientThreadMembersManager } from '@src/api/managers/members/ClientThreadMembersManager'
import { ReadyEventContext } from '@src/events/ctx/ReadyEventContext'
import { ShardConnectedEvent } from '@src/events/ShardConnectedEvent'

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
  otherCacheSymbol,
  'token',
)
export class Client<ClientStack extends DefaultClientStack = DefaultClientStack>
  // @ts-ignore because events can be redefined, and the typed emitter library doesn't like it.
  extends TypedEmitter<ClientStack['events']> {
  /** Token used by this client */
  public readonly token: string

  /** Internal things used by this client */
  public readonly internals: ClientInternals<ClientStack>

  /** Options passed to this client */
  public readonly options: ClientOptions

  /** Guilds manager of this client */
  public readonly guilds: GuildsManager

  /** Users manager of this client */
  public readonly users: UsersManager

  /** Messages manager of this client */
  public readonly messages: ClientMessagesManager

  /** Channels manager of this client */
  public readonly channels: ClientChannelsManager

  /** Stickers manager of this client */
  public readonly stickers: ClientStickersManager

  /** Members manager of this client */
  public readonly members: ClientGuildMembersManager

  /** Roles manager of this client */
  public readonly roles: ClientRolesManager

  /** Presences manager of this client */
  public readonly presences: ClientPresencesManager

  /** Reactions manager of this client */
  public readonly reactions: ClientReactionsManager

  /** Permissions Overwrites manager of this client */
  public readonly overwrites: ClientPermissionOverwritesManager

  /** Thread Members manager of this client */
  public readonly threadMembers: ClientThreadMembersManager

  public readonly [otherCacheSymbol]: OtherCacheManager
  #running = false
  #shardsConnected = 0

  public readyDate?: Date

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

    const ipc = new LocalIpcServer(
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

    const queues: ClientQueues = {
      members: new Collection(),
      ready: new Collection()
    }

    this.internals = {
      rest,
      cache,
      gateway,
      sharding: shardingMetadata,
      ipc,
      actions,
      events,
      metadata: clientMetadata,
      queues,
    }

    this.internals.events.register([ MessageCreateEvent, GuildCreateEvent, PresenceUpdateEvent, ShardConnectedEvent ]) // TODO

    this.overwrites = new ClientPermissionOverwritesManager(this)
    this.threadMembers = new ClientThreadMembersManager(this)
    this[otherCacheSymbol] = new OtherCacheManager(this)
    this.members = new ClientGuildMembersManager(this)
    this.presences = new ClientPresencesManager(this)
    this.reactions = new ClientReactionsManager(this)
    this.messages = new ClientMessagesManager(this)
    this.channels = new ClientChannelsManager(this)
    this.stickers = new ClientStickersManager(this)
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

    await this.internals.gateway.connect(options)
      .then(async () => {
        if (this.internals.sharding.active) await this.internals.ipc.send({
          op: IpcOpCodes.DISPATCH,
          t: IpcEvents.CONNECTED,
          d: {
            event_id: this.internals.sharding.INSTANCE_IPC,
          }
        })
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

    return new Promise(resolve => {
      const interval: NodeJS.Timeout = setInterval(() => {
        if (this._ready) {
          // @ts-ignore
          this.emit(EventNames.READY, { client: this })
          clearInterval(interval)
          this.readyDate = new Date()
          resolve(this)
        }
      }, 1000) as any // HELLO JEST!! THIS IS FOR YOU.
    })
  }

  get readyTimestamp(): number | undefined {
    return this.readyDate ? this.readyDate.getTime() : undefined
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

  private get _ready(): boolean {
    return this.#shardsConnected >= this.internals.sharding.shards.length
  }

  public _increaseConnected() {
    this.#shardsConnected++
  }
}
