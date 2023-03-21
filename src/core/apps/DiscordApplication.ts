import { Final } from '@src/utils/FinalDecorator'
import {
  ApplicationActions,
  ApplicationGateway, ApplicationGatewaySendOptions,
  ApplicationInternals, ApplicationMetadata,
  ApplicationOptions, ApplicationQueues, ApplicationSharding, ApplicationShardingMetadata,
  CompletedApplicationOptions,
  DefaultDiscordApplicationStack,
  ProviderConstructor
} from '@src/core'
import { DiscordRestApplication } from '@src/core/apps/rest/DiscordRestApplication'
import { ApplicationUser } from '@src/api/entities/user/ApplicationUser'
import { DiscordooProviders, EventNames, otherCacheSymbol, WS_DEFAULT_OPTIONS } from '@src/constants'
import { CompletedGatewayOptions, DefaultGatewayProvider, GatewayManager } from '@src/gateway'
import {
  DiscordooError,
  resolveDiscordooShards,
  resolveDiscordShards,
  resolveGatewayIntents,
  ShardListResolvable,
  ValidationError
} from '@src/utils'
import {
  ApplicationEvents,
  ChannelCreateEvent,
  ChannelDeleteEvent,
  ChannelPinsUpdateEvent,
  ChannelUpdateEvent,
  GuildCreateEvent,
  GuildDeleteEvent, GuildEmojisUpdatedEvent,
  GuildMemberAddEvent,
  GuildMemberRemoveEvent,
  GuildMembersChunkEvent,
  GuildMemberUpdateEvent,
  GuildUpdateEvent,
  InteractionCreateEvent,
  InviteCreateEvent,
  InviteDeleteEvent, MessageCreateEvent,
  PresenceUpdateEvent,
  ShardConnectedEvent,
  ThreadCreateEvent, ThreadDeleteEvent,
  ThreadListSyncEvent,
  ThreadMembersUpdateEvent, ThreadMemberUpdateEvent,
  ThreadUpdateEvent, UserUpdateEvent
} from '@src/events'
import {
  BroadcastEvalOptions, BroadcastOptions,
  IpcBroadcastEvalRequestPacket,
  IpcBroadcastEvalResponsePacket,
  IpcBroadcastMessagePacket
} from '@src/sharding'
import { deserializeError, serializeError } from 'serialize-error'
import { is } from 'typescript-is'
import { GatewaySendPayloadLike, GatewayShardsInfo, IpcEvents, IpcOpCodes } from '@discordoo/providers'
import { fromJson, toJson } from '@src/utils/toJson'
import { inspect } from 'util'
import { Collection } from '@discordoo/collection'
import { evalWithoutScopeChain } from '@src/utils/evalWithoutScopeChain'

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
export class DiscordApplication<ApplicationStack extends DefaultDiscordApplicationStack = DefaultDiscordApplicationStack>
  extends DiscordRestApplication<ApplicationStack> {

  /** Internal things used by this app */
  public override readonly internals: ApplicationInternals<ApplicationStack>

  /** Options passed to this app */
  public override readonly options: ApplicationOptions

  /**
   * This app as discord user.
   *
   * **DATA FOR THIS CLASS IS RECEIVED DURING app.start() EXECUTION**. UNTIL THEN, All PROPERTIES WILL BE DEFAULT.
   * */
  public override user: ApplicationUser

  /** When app was connected to discord */
  public readyTimestamp?: number

  #shardsConnected = 0

  constructor(token: string, options: ApplicationOptions = {}) {
    super(token, options)

    this.options = options

    const gatewayOptions: CompletedGatewayOptions = this._makeGatewayOptions()

    const appOptions: CompletedApplicationOptions = {
      ...super.getInternals.options,
      gateway: gatewayOptions
    }

    let gatewayProvider: ProviderConstructor<ApplicationStack['gateway'], DiscordApplication> = DefaultGatewayProvider
    let gatewayProviderOptions

    this.options.providers?.forEach(provider => {
      try {
        switch (provider.provide) {
          case DiscordooProviders.Gateway:
            gatewayProvider = provider.useClass
            gatewayProviderOptions = provider.useOptions
            break
        }
      } catch (e) {
        throw new DiscordooError('DiscordApplication#constructor', 'one of providers threw error when initialized:', e)
      }
    })

    const shardingMetadata: ApplicationShardingMetadata = {
      ...super.getInternals.sharding,
      shards: gatewayOptions.sharding.shards,
      totalShards: gatewayOptions.sharding.totalShards,
    }
    const gateway = new GatewayManager<ApplicationStack['gateway']>(
      this,
      gatewayProvider,
      { gatewayOptions, providerOptions: gatewayProviderOptions }
    )

    const appMetadata: ApplicationMetadata = {
      ...super.getInternals.metadata,
      gatewayVersion: gatewayOptions.connection.version
    }

    const actions = new ApplicationActions(this), events = new ApplicationEvents(this)

    const queues: ApplicationQueues = {
      members: new Collection(),
      ready: new Collection()
    }

    this.internals = {
      ...super.getInternals,
      gateway,
      actions,
      events,
      sharding: shardingMetadata,
      queues,
      metadata: appMetadata,
      options: appOptions
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

    this.user = new ApplicationUser(this)

    void this.user.init({
      id: '',
      username: ''
    })
  }

  override async start(): Promise<DiscordApplication<ApplicationStack>> {
    await super.start()

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
    if (!this.running) throw new DiscordooError('DiscordApplication#destroy', 'Not running.')
    this.running = false

    await this.internals.gateway.disconnect()
    // TODO: clear all cache
    // await this.internals.cache.clear()

    // should we destroy ipc?
    // await this.internals.ipc.destroy()
  }

  get sharding(): ApplicationSharding {
    return {
      options: this.internals.options.ipc,
      app: this as unknown as DiscordApplication,
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
              shards: resolveDiscordooShards({
                app: this.app,
                shards: options?.instance ?? 'all'
              }),
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

        const shards = resolveDiscordooShards({
          app: this.app,
          shards: options?.instance ?? 'all'
        })

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

  private get _ready(): boolean {
    return this.#shardsConnected >= this.internals.sharding.shards.length
  }

  public _increaseConnected() {
    this.#shardsConnected++
  }

  public toJSON() {
    return `[app ${this.constructor.name}]`
  }
}