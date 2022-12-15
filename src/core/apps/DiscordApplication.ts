// TODO: (╯°□°）╯︵ ┻━┻
import {
  DiscordooProviders,
  EventNames,
  GlobalCachingPolicy,
  IpcEvents,
  IpcOpCodes,
  otherCacheSymbol,
  REST_DEFAULT_OPTIONS,
  WS_DEFAULT_OPTIONS
} from '@src/constants'
import {
  DiscordooError,
  DiscordooSnowflake,
  resolveDiscordooShards,
  resolveDiscordShards,
  resolveGatewayIntents,
  ShardListResolvable,
  ValidationError,
  version
} from '@src/utils'
import { ApplicationGuildMembersManager } from '@src/api/managers/members/ApplicationGuildMembersManager'
import { CompletedLocalIpcOptions } from '@src/sharding/CompletedLocalIpcOptions'
import { ApplicationMessagesManager } from '@src/api/managers/messages/ApplicationMessagesManager'
import { ApplicationChannelsManager } from '@src/api/managers/channels/ApplicationChannelsManager'
import { ApplicationStickersManager } from '@src/api/managers/stickers/ApplicationStickersManager'
import { ApplicationOptions, CompletedClientOptions } from '@src/core/apps/interfaces/ApplicationOptions'
import { LOCAL_IPC_DEFAULT_OPTIONS } from '@src/constants/sharding/IpcDefaultOptions'
import { CompletedCacheOptions } from '@src/cache/interfaces/CompletedCacheOptions'
import { CompletedGatewayOptions } from '@src/gateway/interfaces/GatewayOptions'
import { ApplicationShardingMetadata } from '@src/core/apps/interfaces/ApplicationShardingMetadata'
import { CACHE_OPTIONS_KEYS_LENGTH } from '@src/cache/interfaces/CacheOptions'
import { ProviderConstructor } from '@src/core/providers/ProviderConstructor'
import { DefaultGatewayProvider } from '@src/gateway/DefaultGatewayProvider'
import { DefaultApplicationStack } from '@src/core/apps/interfaces/DefaultApplicationStack'
import { CompletedRestOptions } from '@src/rest/interfaces/RestOptions'
import { DefaultCacheProvider } from '@src/cache/DefaultCacheProvider'
import { DefaultRestProvider } from '@src/rest/DefaultRestProvider'
import { ApplicationInternalApi } from '@src/core/apps/ApplicationInternalApi'
import { ApplicationMetadata } from '@src/core/apps/interfaces/ApplicationMetadata'
import { ApplicationActions } from '@src/core/apps/ApplicationActions'
import {
  ChannelCreateEvent,
  ChannelDeleteEvent,
  ChannelPinsUpdateEvent,
  ChannelUpdateEvent,
  ApplicationEvents, GuildMemberAddEvent, GuildMemberRemoveEvent, GuildMemberUpdateEvent, InviteCreateEvent, InviteDeleteEvent,
  MessageCreateEvent,
  ThreadCreateEvent,
  ThreadDeleteEvent,
  ThreadListSyncEvent,
  ThreadMembersUpdateEvent,
  ThreadMemberUpdateEvent,
  ThreadUpdateEvent, UserUpdateEvent
} from '@src/events'
import { UsersManager } from '@src/api/managers/UsersManager'
import { ApplicationRolesManager } from '@src/api/managers/roles'
import { GatewayManager } from '@src/gateway/GatewayManager'
import { GatewaySendPayloadLike, GatewayShardsInfo } from '@discordoo/providers'
import { LocalIpcServer } from '@src/sharding/ipc/LocalIpcServer'
import { CacheManager } from '@src/cache/CacheManager'
import { RestManager } from '@src/rest/RestManager'
import { TypedEmitter } from 'tiny-typed-emitter'
import { ApplicationDirectMessagesChannelsManager, ApplicationInvitesManager, ApplicationGuildsManager } from '@src/api/managers'
import { Final } from '@src/utils/FinalDecorator'
import { IpcServerOptions } from '@src/sharding'
import { EntitiesUtil } from '@src/api/entities/EntitiesUtil'
import { ApplicationPresencesManager } from '@src/api/managers/presences'
import { ApplicationReactionsManager } from '@src/api/managers/reactions/ApplicationReactionsManager'
import { ApplicationPermissionOverwritesManager } from '@src/api/managers/overwrites/ApplicationPermissionOverwritesManager'
import { GuildCreateEvent } from '@src/events/guild/GuildCreateEvent'
import { PresenceUpdateEvent } from '@src/events/PresenceUpdateEvent'
import { ApplicationQueues } from '@src/core/apps/interfaces/ApplicationQueues'
import { Collection } from '@discordoo/collection'
import { OtherCacheManager } from '@src/api/managers/OtherCacheManager'
import { ApplicationThreadMembersManager } from '@src/api/managers/members/ApplicationThreadMembersManager'
import { ShardConnectedEvent } from '@src/events/ShardConnectedEvent'
import { GuildMembersChunkEvent } from '@src/events/GuildMembersChunkEvent'
import { ApplicationEmojisManager } from '@src/api/managers/emojis/ApplicationEmojisManager'
import { ApplicationSharding } from '@src/core/apps/interfaces/ApplicationSharding'
import { BroadcastEvalOptions } from '@src/sharding/interfaces/ipc/BroadcastEvalOptions'
import { BroadcastOptions } from '@src/sharding/interfaces/ipc/BroadcastOptions'
import { fromJson, toJson } from '@src/utils/toJson'
import { evalWithoutScopeChain } from '@src/utils/evalWithoutScopeChain'
import {
  IpcBroadcastEvalRequestPacket,
  IpcBroadcastEvalResponsePacket,
  IpcBroadcastMessagePacket
} from '@src/sharding/interfaces/ipc/IpcPackets'
import { deserializeError, serializeError } from 'serialize-error'
import { is } from 'typescript-is'
import { ApplicationGateway } from '@src/core'
import { ApplicationGatewaySendOptions } from '@src/core/apps/interfaces/ApplicationGatewaySendOptions'
import { inspect } from 'util'
import { ApplicationUser } from '@src/api/entities/user/ApplicationUser'
import { GuildEmojisUpdatedEvent } from '@src/events/emoji/GuildEmojisUpdatedEvent'
import { GuildDeleteEvent, GuildUpdateEvent } from '@src/events/guild'
import { InteractionCreateEvent } from '@src/events/interaction/InteractionCreateEvent'
import { ApplicationInteractionsManager } from '@src/api/managers/interactions/ApplicationInteractionsManager'

/** Entry point for **all** of Discordoo. */
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
  'threadMembers',
  'emojis',
  'invites',
  'interactions',
  otherCacheSymbol,
  'token',
)
export class DiscordApplication<ApplicationStack extends DefaultApplicationStack = DefaultApplicationStack>
  // @ts-ignore because events can be redefined, and the typed emitter library doesn't like it.
  extends TypedEmitter<ApplicationStack['events']> {
  /** Token used by this app */
  public readonly token: string

  /** Internal things used by this app */
  public readonly internals: ApplicationInternalApi<ApplicationStack>

  /** Options passed to this app */
  public readonly options: ApplicationOptions

  /** Guilds manager for this app */
  public readonly guilds: ApplicationGuildsManager

  /** Users manager for this app */
  public readonly users: UsersManager

  /** Messages manager for this app */
  public readonly messages: ApplicationMessagesManager

  /** Channels manager for this app */
  public readonly channels: ApplicationChannelsManager

  /** Direct messages channels manager for this app */
  public readonly dms: ApplicationDirectMessagesChannelsManager

  /** Stickers manager for this app */
  public readonly stickers: ApplicationStickersManager

  /** Members manager for this app */
  public readonly members: ApplicationGuildMembersManager

  /** Roles manager for this app */
  public readonly roles: ApplicationRolesManager

  /** Presences manager for this app */
  public readonly presences: ApplicationPresencesManager

  /** Reactions manager for this app */
  public readonly reactions: ApplicationReactionsManager

  /** Permissions Overwrites manager for this app */
  public readonly overwrites: ApplicationPermissionOverwritesManager

  /** Thread Members manager for this app */
  public readonly threadMembers: ApplicationThreadMembersManager

  /** Emojis manager for this app */
  public readonly emojis: ApplicationEmojisManager

  /** Invites manager for this app */
  public readonly invites: ApplicationInvitesManager
  /** Interactions manager for this app */
  public readonly interactions: ApplicationInteractionsManager

  public readonly [otherCacheSymbol]: OtherCacheManager
  #running = false
  #shardsConnected = 0

  /** When app was connected to discord */
  public readyTimestamp?: number

  /**
   * This app as discord user.
   *
   * **DATA FOR THIS CLASS IS RECEIVED DURING app.start() EXECUTION**. UNTIL THEN, All PROPERTIES WILL BE DEFAULT.
   * */
  public user: ApplicationUser

  constructor(token: string, options: ApplicationOptions = {}) {
    super()

    options.extenders?.forEach(e => {
      EntitiesUtil.extend(e.entity, e.extender)
    })

    this.token = token
    this.options = options

    const gatewayOptions: CompletedGatewayOptions = this._makeGatewayOptions()
    const restOptions: CompletedRestOptions = this._makeRestOptions()
    const cacheOptions: CompletedCacheOptions = this._makeCacheOptions()
    const ipcOptions: CompletedLocalIpcOptions = this._makeLocalIpcOptions()

    const appOptions: CompletedClientOptions = DiscordApplication._makeClientOptions(
      gatewayOptions,
      restOptions,
      cacheOptions,
      ipcOptions
    )

    let restProvider: ProviderConstructor<ApplicationStack['rest']> = DefaultRestProvider
    let cacheProvider: ProviderConstructor<ApplicationStack['cache']> = DefaultCacheProvider
    let gatewayProvider: ProviderConstructor<ApplicationStack['gateway']> = DefaultGatewayProvider
    let restProviderOptions, gatewayProviderOptions, cacheProviderOptions

    const MANAGER_IPC = process.env.SHARDING_MANAGER_IPC ?? DiscordooSnowflake.generatePartial()
    const INSTANCE_IPC = process.env.SHARDING_INSTANCE_IPC ?? DiscordooSnowflake.generatePartial()

    this.options.providers?.forEach(provider => {
      try {
        switch (provider.provide) {
          case DiscordooProviders.Cache:
            cacheProvider = provider.useClass
            cacheProviderOptions = provider.useOptions
            break

          case DiscordooProviders.Gateway:
            gatewayProvider = provider.useClass
            gatewayProviderOptions = provider.useOptions
            break

          case DiscordooProviders.Rest:
            restProvider = provider.useClass
            restProviderOptions = provider.useOptions
            break
        }
      } catch (e) {
        throw new DiscordooError('DiscordApplication#constructor', 'one of providers threw error when initialized:', e)
      }
    })

    const shardingMetadata: ApplicationShardingMetadata = {
      MANAGER_IPC,
      INSTANCE_IPC,
      instance: parseInt(process.env.SHARDING_INSTANCE ?? '0'),
      shards: gatewayOptions.sharding.shards,
      totalShards: gatewayOptions.sharding.totalShards,
      active: DiscordooSnowflake.deconstruct(MANAGER_IPC).shardId === DiscordooSnowflake.SHARDING_MANAGER_ID,
    }

    const rest = new RestManager<ApplicationStack['rest']>(
      this,
      restProvider,
      { restOptions, providerOptions: restProviderOptions }
    )
    const cache = new CacheManager<ApplicationStack['cache']>(
      this,
      cacheProvider,
      { cacheOptions, providerOptions: cacheProviderOptions }
    )
    const gateway = new GatewayManager<ApplicationStack['gateway']>(
      this,
      gatewayProvider,
      { gatewayOptions, providerOptions: gatewayProviderOptions }
    )
    const ipc = new LocalIpcServer(
      this,
      this._makeIpcServerOptions(ipcOptions, shardingMetadata)
    )

    const allCacheDisabled = (() => {
      if (appOptions.cache.global?.policies.includes(GlobalCachingPolicy.None)) return true

      const options = Object.entries(this.options.cache ?? {})
      const total = options.length, defaultTotal = CACHE_OPTIONS_KEYS_LENGTH
      if (total === 0 || total < defaultTotal) return false

      let disabled = 0

      for (const [ policy ] of options) {
        if (policy.includes('none')) disabled++
      }

      return defaultTotal === disabled
    })()

    const appMetadata: ApplicationMetadata = {
      version,
      shardingUsed: shardingMetadata.active,
      restRateLimitsDisabled: restOptions.limits.disable,
      restVersion: restOptions.api.version,
      gatewayVersion: gatewayOptions.connection.version,
      allCacheDisabled,
      machinesShardingUsed: false // not supported yet
    }

    const actions = new ApplicationActions(this), events = new ApplicationEvents(this)

    const queues: ApplicationQueues = {
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
      metadata: appMetadata,
      queues,
      options: appOptions,
    }

    this.internals.events.register([
      MessageCreateEvent, GuildCreateEvent, GuildDeleteEvent, PresenceUpdateEvent,
      ShardConnectedEvent, ChannelCreateEvent, ChannelUpdateEvent, ChannelDeleteEvent,
      ChannelPinsUpdateEvent, ThreadCreateEvent, ThreadUpdateEvent, ThreadDeleteEvent,
      ThreadListSyncEvent, GuildMembersChunkEvent, ThreadMemberUpdateEvent, ThreadMembersUpdateEvent,
      GuildEmojisUpdatedEvent, GuildUpdateEvent, UserUpdateEvent,
      GuildMemberUpdateEvent, GuildMemberAddEvent, GuildMemberRemoveEvent, InviteCreateEvent,
      InviteDeleteEvent, InteractionCreateEvent
    ]) // TODO

    this.overwrites = new ApplicationPermissionOverwritesManager(this)
    this.threadMembers = new ApplicationThreadMembersManager(this)
    this.dms = new ApplicationDirectMessagesChannelsManager(this)
    this.interactions = new ApplicationInteractionsManager(this)
    this[otherCacheSymbol] = new OtherCacheManager(this)
    this.members = new ApplicationGuildMembersManager(this)
    this.presences = new ApplicationPresencesManager(this)
    this.reactions = new ApplicationReactionsManager(this)
    this.messages = new ApplicationMessagesManager(this)
    this.channels = new ApplicationChannelsManager(this)
    this.stickers = new ApplicationStickersManager(this)
    this.invites = new ApplicationInvitesManager(this)
    this.emojis = new ApplicationEmojisManager(this)
    this.roles = new ApplicationRolesManager(this)
    this.guilds = new ApplicationGuildsManager(this)
    this.users = new UsersManager(this)
    this.user = new ApplicationUser(this)

    void this.user.init({
      id: '',
      username: ''
    })
  }

  async start(): Promise<DiscordApplication<ApplicationStack>> {
    if (this.#running) throw new DiscordooError('DiscordApplication#start', 'Already running.')
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

    this.once('shardConnected', ctx => {
      this.user.init(ctx.user)
    })

    try {
      await this.internals.gateway.connect(options)
    } catch (e) {
      if (this.internals.sharding.active) await this.internals.ipc.send({
        op: IpcOpCodes.ERROR,
        d: {
          event_id: this.internals.sharding.INSTANCE_IPC,
          error: serializeError(e ?? new DiscordooError('GatewayManager', 'Unknown Error:', inspect(e)))
        }
      })

      throw e
    }

    if (this.internals.sharding.active) await this.internals.ipc.send({
      op: IpcOpCodes.DISPATCH,
      t: IpcEvents.CONNECTED,
      d: {
        event_id: this.internals.sharding.INSTANCE_IPC,
      }
    })

    return new Promise(resolve => {
      const interval: NodeJS.Timeout = setInterval(() => {
        if (this._ready) {
          // @ts-ignore
          this.emit(EventNames.READY, { app: this })
          clearInterval(interval)
          this.readyTimestamp = new Date().getTime()
          resolve(this)
        }
      }, 100) as any // HELLO JEST!! THIS IS FOR YOU.
    })
  }

  async destroy(): Promise<void> {
    if (!this.#running) throw new DiscordooError('DiscordApplication#destroy', 'Not running.')
    this.#running = false

    await this.internals.gateway.disconnect()
    // TODO: clear all cache
    // await this.internals.cache.clear()

    // should we destroy ipc?
    // await this.internals.ipc.destroy()
  }

  get sharding(): ApplicationSharding {
    return {
      options: this.internals.options.ipc,
      app: this,
      active: this.internals.sharding.active,
      shards: this.internals.sharding.shards,
      totalShards: this.internals.sharding.totalShards,
      instance: this.internals.sharding.instance,

      async eval<R = any, C = Record<any, any>>(
        script: string | ((context: (C & { app: DiscordApplication })) => any), options?: BroadcastEvalOptions
      ): Promise<R[]> {
        const context = {
          ...options?.context ? toJson(options.context) : {}
        }

        const type = typeof script

        if (type !== 'string' && type !== 'function') {
          throw new DiscordooError('ApplicationSharding#eval', 'Script to eval must be function or string.')
        }

        const func = type === 'string'
          ? `(async (context) => { ${script} })`
          : `(${script})`

        if (!this.active) {
          context.app = this.app

          const result = await evalWithoutScopeChain(context, func)

          return toJson([ result ])
        } else {
          const request: IpcBroadcastEvalRequestPacket = {
            op: IpcOpCodes.DISPATCH,
            t: IpcEvents.BROADCAST_EVAL,
            d: {
              event_id: this.app.internals.ipc.generate(),
              script: func,
              shards: resolveDiscordooShards(this.app, options?.instance ?? 'all'),
              context,
            }
          }

          return this.app.internals.ipc.send<IpcBroadcastEvalResponsePacket>(
            request, { waitResponse: true }
          )
            .then(r => fromJson(r.d.result)) // convert bigint pointer to bigint
            .catch(p => { throw p.d?.result ? deserializeError(p.d.result) : p })
        }
      },

      send(message: string, options?: BroadcastOptions): unknown {
        if (!is<string>(message)) {
          throw new DiscordooError('ApplicationSharding#broadcast', 'Message must be string.')
        }

        const shards = resolveDiscordooShards(this.app, options?.instance ?? 'all')

        if (!this.active) {
          if (shards.includes(this.instance)) {
            this.app.emit('ipcMessage', {
              from: this.instance,
              message
            })
          }
        } else {
          const packet: IpcBroadcastMessagePacket = {
            op: IpcOpCodes.DISPATCH,
            t: IpcEvents.MESSAGE,
            d: {
              event_id: this.app.internals.ipc.generate(),
              message,
              shards,
              from: this.instance
            }
          }

          void this.app.internals.ipc.send(packet)
        }

        return undefined
      }
    }
  }

  get gateway(): ApplicationGateway {
    return {
      options: this.internals.gateway.options,
      app: this,
      ping: this.internals.gateway.ping(),
      shards: this.internals.sharding.shards,

      latency(shards: ShardListResolvable): Array<[ number, number ]> {
        return this.app.internals.gateway.ping(resolveDiscordShards(shards))
      },

      reconnect(shards?: ShardListResolvable): Promise<unknown> {
        return this.app.internals.gateway.reconnect(shards ? resolveDiscordShards(shards) : undefined)
      },

      disconnect(shards?: ShardListResolvable): Promise<unknown> {
        return this.app.internals.gateway.disconnect(shards ? resolveDiscordShards(shards) : undefined)
      },

      send(data: GatewaySendPayloadLike, options?: ApplicationGatewaySendOptions): unknown {
        if (!is<GatewaySendPayloadLike>(data)) {
          throw new ValidationError('DiscordApplication.gateway', 'Incorrect gateway send payload')._setInvalidOptions(data)
        }

        if (!is<ApplicationGatewaySendOptions | undefined | null>(options)) {
          throw new ValidationError('DiscordApplication.gateway', 'Incorrect gateway send options')._setInvalidOptions(options)
        }

        return this.app.internals.gateway.send(data, {
          ...options,
          shards: options?.shards ? resolveDiscordShards(options.shards): undefined
        })
      }
    }
  }

  get readyDate(): Date | undefined {
    return this.readyTimestamp ? new Date(this.readyTimestamp) : undefined
  }

  private static _makeClientOptions(
    gateway: CompletedGatewayOptions, rest: CompletedRestOptions, cache: CompletedCacheOptions, ipc: CompletedLocalIpcOptions
  ): CompletedClientOptions {
    return {
      gateway,
      rest,
      cache,
      ipc
    }
  }

  private _makeGatewayOptions(): CompletedGatewayOptions {
    const options = {
      token: this.token,
      intents: resolveGatewayIntents(this.options.gateway?.intents ?? WS_DEFAULT_OPTIONS.intents),
      presence: this.options.gateway?.presence ?? WS_DEFAULT_OPTIONS.presence,
      sharding: Object.assign({}, this.options.gateway?.sharding ?? {}, WS_DEFAULT_OPTIONS.sharding),
      connection: Object.assign({}, this.options.gateway?.connection ?? {}, WS_DEFAULT_OPTIONS.connection),
      events: Object.assign({}, this.options.gateway?.events ?? {}, WS_DEFAULT_OPTIONS.events)
    }

    const shards = resolveDiscordShards(options.sharding.shards)
    const totalShards = shards.length

    options.sharding.shards = shards
    options.sharding.totalShards = totalShards

    return options
  }

  private _makeRestOptions(): CompletedRestOptions {
    return {
      requestTimeout: this.options.rest?.requestTimeout ?? REST_DEFAULT_OPTIONS.requestTimeout,
      userAgent: this.options.rest?.userAgent ?? REST_DEFAULT_OPTIONS.userAgent,
      retries: this.options.rest?.retries ?? REST_DEFAULT_OPTIONS.retries,
      api: Object.assign({}, REST_DEFAULT_OPTIONS.api, { auth: `Bot ${this.token}` }, this.options.rest?.api),
      cdn: Object.assign({}, REST_DEFAULT_OPTIONS.cdn, this.options.rest?.cdn),
      limits: Object.assign({}, REST_DEFAULT_OPTIONS.limits, this.options.rest?.limits)
    }
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

  private get _ready(): boolean {
    return this.#shardsConnected >= this.internals.sharding.shards.length
  }

  public _increaseConnected() {
    this.#shardsConnected++
  }

  toJSON() {
    return `[app ${this.constructor.name}]`
  }
}
