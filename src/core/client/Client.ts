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
import { ClientGuildMembersManager } from '@src/api/managers/members/ClientGuildMembersManager'
import { CompletedLocalIpcOptions } from '@src/constants/sharding/CompletedLocalIpcOptions'
import { ClientMessagesManager } from '@src/api/managers/messages/ClientMessagesManager'
import { ClientChannelsManager } from '@src/api/managers/channels/ClientChannelsManager'
import { ClientStickersManager } from '@src/api/managers/stickers/ClientStickersManager'
import { ClientOptions, CompletedClientOptions } from '@src/core/client/ClientOptions'
import { LOCAL_IPC_DEFAULT_OPTIONS } from '@src/constants/sharding/IpcDefaultOptions'
import { CompletedCacheOptions } from '@src/cache/interfaces/CompletedCacheOptions'
import { CompletedGatewayOptions } from '@src/gateway/interfaces/GatewayOptions'
import { ClientShardingMetadata } from '@src/core/client/ClientShardingMetadata'
import { CACHE_OPTIONS_KEYS_LENGTH } from '@src/cache/interfaces/CacheOptions'
import { ProviderConstructor } from '@src/core/providers/ProviderConstructor'
import { DefaultGatewayProvider } from '@src/gateway/DefaultGatewayProvider'
import { DefaultClientStack } from '@src/core/client/DefaultClientStack'
import { CompletedRestOptions } from '@src/rest/interfaces/RestOptions'
import { DefaultCacheProvider } from '@src/cache/DefaultCacheProvider'
import { DefaultRestProvider } from '@src/rest/DefaultRestProvider'
import { ClientInternals } from '@src/core/client/ClientInternals'
import { ClientMetadata } from '@src/core/client/ClientMetadata'
import { ClientActions } from '@src/core/client/ClientActions'
import {
  ChannelCreateEvent,
  ChannelDeleteEvent,
  ChannelPinsUpdateEvent,
  ChannelUpdateEvent,
  ClientEvents,
  MessageCreateEvent,
  ThreadCreateEvent,
  ThreadDeleteEvent,
  ThreadListSyncEvent,
  ThreadMembersUpdateEvent,
  ThreadMemberUpdateEvent,
  ThreadUpdateEvent
} from '@src/events'
import { UsersManager } from '@src/api/managers/UsersManager'
import { ClientRolesManager } from '@src/api/managers/roles'
import { GatewayManager } from '@src/gateway/GatewayManager'
import { GatewaySendPayloadLike, GatewayShardsInfo } from '@discordoo/providers'
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
import { ClientThreadMembersManager } from '@src/api/managers/members/ClientThreadMembersManager'
import { ShardConnectedEvent } from '@src/events/ShardConnectedEvent'
import { GuildMembersChunkEvent } from '@src/events/GuildMembersChunkEvent'
import { ClientEmojisManager } from '@src/api/managers/emojis/ClientEmojisManager'
import { ClientShardingApplication } from '@src/core/client/app/ClientShardingApplication'
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
import { ClientGatewayApplication } from '@src/core'
import { GatewayAppSendOptions } from '@src/core/client/app/GatewayAppSendOptions'
import { inspect } from 'util'
import { ClientUser } from '@src/api/entities/user/ClientUser'
import { GuildEmojisUpdatedEvent } from '@src/events/emoji/GuildEmojisUpdatedEvent'

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

  /** Guilds manager for this client */
  public readonly guilds: GuildsManager

  /** Users manager for this client */
  public readonly users: UsersManager

  /** Messages manager for this client */
  public readonly messages: ClientMessagesManager

  /** Channels manager for this client */
  public readonly channels: ClientChannelsManager

  /** Stickers manager for this client */
  public readonly stickers: ClientStickersManager

  /** Members manager for this client */
  public readonly members: ClientGuildMembersManager

  /** Roles manager for this client */
  public readonly roles: ClientRolesManager

  /** Presences manager for this client */
  public readonly presences: ClientPresencesManager

  /** Reactions manager for this client */
  public readonly reactions: ClientReactionsManager

  /** Permissions Overwrites manager for this client */
  public readonly overwrites: ClientPermissionOverwritesManager

  /** Thread Members manager for this client */
  public readonly threadMembers: ClientThreadMembersManager

  /** Emojis manager for this client */
  public readonly emojis: ClientEmojisManager

  public readonly [otherCacheSymbol]: OtherCacheManager
  #running = false
  #shardsConnected = 0

  /** When client fully connected to discord */
  public readyTimestamp?: number

  /**
   * This client as discord user.
   *
   * **DATA FOR THIS CLASS IS RECEIVED DURING EXECUTION OF client.start()**. UNTIL THEN, ALL PROPERTIES WILL BE DEFAULT.
   * */
  public user: ClientUser

  constructor(token: string, options: ClientOptions = {}) {
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

    const clientOptions: CompletedClientOptions = Client._makeClientOptions(
      gatewayOptions,
      restOptions,
      cacheOptions,
      ipcOptions
    )

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
      shards: gatewayOptions.sharding.shards,
      totalShards: gatewayOptions.sharding.totalShards,
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
      if (clientOptions.cache.global?.policies.includes(GlobalCachingPolicy.NONE)) return true

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
      restRateLimitsDisabled: restOptions.limits.disable,
      restVersion: restOptions.api.version,
      gatewayVersion: gatewayOptions.connection.version,
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
      options: clientOptions,
    }

    this.internals.events.register([
      MessageCreateEvent, GuildCreateEvent, PresenceUpdateEvent, ShardConnectedEvent,
      ChannelCreateEvent, ChannelUpdateEvent, ChannelDeleteEvent, ChannelPinsUpdateEvent,
      ThreadCreateEvent, ThreadUpdateEvent, ThreadDeleteEvent, ThreadListSyncEvent,
      GuildMembersChunkEvent, ThreadMemberUpdateEvent, ThreadMembersUpdateEvent,
      GuildEmojisUpdatedEvent,
    ]) // TODO

    this.overwrites = new ClientPermissionOverwritesManager(this)
    this.threadMembers = new ClientThreadMembersManager(this)
    this[otherCacheSymbol] = new OtherCacheManager(this)
    this.members = new ClientGuildMembersManager(this)
    this.presences = new ClientPresencesManager(this)
    this.reactions = new ClientReactionsManager(this)
    this.messages = new ClientMessagesManager(this)
    this.channels = new ClientChannelsManager(this)
    this.stickers = new ClientStickersManager(this)
    this.emojis = new ClientEmojisManager(this)
    this.roles = new ClientRolesManager(this)
    this.guilds = new GuildsManager(this)
    this.users = new UsersManager(this)
    this.user = new ClientUser(this)

    void this.user.init({
      id: '',
      username: ''
    })
  }

  async start(): Promise<Client<ClientStack>> {
    if (this.#running) throw new DiscordooError('Client#start', 'Already running.')
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
          this.emit(EventNames.READY, { client: this })
          clearInterval(interval)
          this.readyTimestamp = new Date().getTime()
          resolve(this)
        }
      }, 100) as any // HELLO JEST!! THIS IS FOR YOU.
    })
  }

  get sharding(): ClientShardingApplication {
    return {
      options: this.internals.options.ipc,
      client: this,
      active: this.internals.sharding.active,
      shards: this.internals.sharding.shards,
      totalShards: this.internals.sharding.totalShards,
      instance: this.internals.sharding.instance,

      async eval<R = any, C = Record<any, any>>(
        script: string | ((context: (C & { client: Client })) => any), options?: BroadcastEvalOptions
      ): Promise<R[]> {
        const context = {
          ...options?.context ? toJson(options.context) : {}
        }

        const type = typeof script

        if (type !== 'string' && type !== 'function') {
          throw new DiscordooError('ClientShardingApplication#eval', 'Script to eval must be function or string.')
        }

        const func = type === 'string'
          ? `(async (context) => { ${script} })`
          : `(${script})`

        if (!this.active) {
          context.client = this.client

          const result = await evalWithoutScopeChain(context, func)

          return toJson([ result ])
        } else {
          const request: IpcBroadcastEvalRequestPacket = {
            op: IpcOpCodes.DISPATCH,
            t: IpcEvents.BROADCAST_EVAL,
            d: {
              event_id: this.client.internals.ipc.generate(),
              script: func,
              shards: resolveDiscordooShards(this.client, options?.instance ?? 'all'),
              context,
            }
          }

          return this.client.internals.ipc.send<IpcBroadcastEvalResponsePacket>(
            request, { waitResponse: true }
          )
            .then(r => fromJson(r.d.result)) // convert bigint pointer to bigint
            .catch(p => { throw p.d?.result ? deserializeError(p.d.result) : p })
        }
      },

      send(message: string, options?: BroadcastOptions): unknown {
        if (!is<string>(message)) {
          throw new DiscordooError('ClientShardingApplication#broadcast', 'Message must be string.')
        }

        const shards = resolveDiscordooShards(this.client, options?.instance ?? 'all')

        if (!this.active) {
          if (shards.includes(this.instance)) {
            this.client.emit('ipcMessage', {
              from: this.instance,
              message
            })
          }
        } else {
          const packet: IpcBroadcastMessagePacket = {
            op: IpcOpCodes.DISPATCH,
            t: IpcEvents.MESSAGE,
            d: {
              event_id: this.client.internals.ipc.generate(),
              message,
              shards,
              from: this.instance
            }
          }

          void this.client.internals.ipc.send(packet)
        }

        return undefined
      }
    }
  }

  get gateway(): ClientGatewayApplication {
    return {
      options: this.internals.gateway.options,
      client: this,
      ping: this.internals.gateway.ping(),
      shards: this.internals.sharding.shards,

      latency(shards: ShardListResolvable): Array<[ number, number ]> {
        return this.client.internals.gateway.ping(resolveDiscordShards(shards))
      },

      reconnect(shards?: ShardListResolvable): Promise<unknown> {
        return this.client.internals.gateway.reconnect(shards ? resolveDiscordShards(shards) : undefined)
      },

      send(data: GatewaySendPayloadLike, options?: GatewayAppSendOptions): unknown {
        if (!is<GatewaySendPayloadLike>(data)) {
          throw new ValidationError('Client.gateway', 'Incorrect gateway send payload')._setInvalidOptions(data)
        }

        if (!is<GatewayAppSendOptions | undefined | null>(options)) {
          throw new ValidationError('Client.gateway', 'Incorrect gateway send options')._setInvalidOptions(options)
        }

        return this.client.internals.gateway.send(data, {
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

  toJSON() {
    return `[client ${this.constructor.name}]`
  }
}
