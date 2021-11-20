import { TypedEmitter } from 'tiny-typed-emitter'
import { IpcServerOptions } from '@src/sharding/interfaces/ipc/IpcServerOptions'
import { IPC as RawIpc, server as RawIpcServer } from 'node-ipc'
import { Collection } from '@discordoo/collection'
import { IpcCacheOpCodes, IpcEvents, IpcOpCodes, RAW_IPC_EVENT } from '@src/constants'
import { IpcPacket } from '@src/sharding'
import { DiscordooError, DiscordooSnowflake } from '@src/utils'
import { IpcServerSendOptions } from '@src/sharding/interfaces/ipc/IpcServerSendOptions'
import {
  IpcCacheRequestPacket,
  IpcCacheResponsePacket,
  IpcDispatchPacket,
  IpcGuildMembersRequestPacket,
  IpcGuildMembersResponsePacket,
  IpcHelloPacket,
  IpcIdentifyPacket
} from '@src/sharding/interfaces/ipc/IpcPackets'
import { IpcServerEvents } from '@src/sharding/interfaces/ipc/IpcServerEvents'
import { Client } from '@src/core'
import { GuildMemberData } from '@src/api'
import { RawGuildMembersFetchOptions } from '@src/api/managers/members/RawGuildMembersFetchOptions'

export class LocalIpcServer extends TypedEmitter<IpcServerEvents> {
  private readonly bucket: Collection = new Collection()
  private managerSocket: any
  private readonly MANAGER_IPC: string
  private readonly eventsHandler: any

  public ipc: InstanceType<typeof RawIpc>
  public server?: typeof RawIpcServer
  public readonly INSTANCE_IPC: string
  public readonly instance: number

  public readonly client: Client

  constructor(client: Client, options: IpcServerOptions) {
    super()

    this.client = client
    this.ipc = new RawIpc()

    this.INSTANCE_IPC = this.ipc.config.id = options.INSTANCE_IPC
    this.MANAGER_IPC = options.MANAGER_IPC
    this.instance = options.instance

    this.ipc.config = Object.assign(this.ipc.config, options.config ?? {})

    this.eventsHandler = (data: IpcPacket, socket: any) => {
      if (this.listeners('RAW').length) this.emit('RAW', data)
      return this.onPacket(data, socket)
    }
  }

  async serve(): Promise<IpcHelloPacket> {
    this.ipc.serve(() => {
      this.server!.on(RAW_IPC_EVENT, this.eventsHandler)
    })

    this.server = this.ipc.server

    this.server.start()

    let promise
    return new Promise((resolve, reject) => {
      promise = { res: resolve, rej: reject }

      promise.timeout = setTimeout(() => {
        this.bucket.delete('__CONNECTION_PROMISE__')
        reject(new DiscordooError('LocalIpcServer#serve', 'connection to sharding manager timed out.'))
      }, 30000)

      this.bucket.set('__CONNECTION_PROMISE__', promise)
    })
  }

  destroy() {
    if (!this.server) return

    this.server.off(RAW_IPC_EVENT, this.eventsHandler)
    this.server.stop()
  }

  private async onPacket(packet: IpcPacket, socket: any) {
    // console.log('IPC SERVER', this.instance, 'ON PACKET', process.hrtime.bigint())
    if (packet.d?.event_id) {
      const promise = this.bucket.get(packet.d.event_id)

      if (promise) {
        clearTimeout(promise.timeout)
        this.bucket.delete(packet.d.event_id)

        packet.op === IpcOpCodes.ERROR ? promise.rej(packet) : promise.res(packet)

        if (packet.op !== IpcOpCodes.HELLO) return
      }
    }

    switch (packet.op) {

      case IpcOpCodes.HELLO:
        return this.hello(packet as IpcHelloPacket, socket)

      case IpcOpCodes.DISPATCH:
        return this.dispatch(packet as IpcDispatchPacket)

      case IpcOpCodes.CACHE_OPERATE: {
        // console.log('IPC SERVER', this.instance, 'ON CACHE OPERATE', process.hrtime.bigint())
        let success = true

        // console.log('IPC SERVER', this.instance, 'ON RESULT', packet)
        const result = await this.cacheOperate(packet as IpcCacheRequestPacket)
          .catch(e => {
            success = false
            return e
          })

        // console.log('IPC SERVER', this.instance, 'ON RESPONSE', result)
        const response: IpcCacheResponsePacket = {
          op: IpcOpCodes.CACHE_OPERATE,
          d: {
            event_id: packet.d.event_id,
            success,
            result: this.client.internals.cache.convertToJson(result)
          }
        }

        // console.log('IPC SERVER', this.instance, 'ON CACHE OPERATE REPLY', process.hrtime.bigint())
        return this.send(response)
      }
    }
  }

  private async dispatch(packet: IpcDispatchPacket) { // TODO: IpcDispatchPackets
    switch (packet.t) {
      case IpcEvents.DESTROYING:
        this.destroy()
        process.exit(0)
        break
      case IpcEvents.GUILD_MEMBERS_REQUEST: {
        const members = await this.guildMembersRequest(packet as IpcGuildMembersRequestPacket)

        const response: IpcGuildMembersResponsePacket = {
          op: IpcOpCodes.DISPATCH,
          t: IpcEvents.GUILD_MEMBERS_REQUEST,
          d: {
            shard_id: packet.d.shard_id,
            members,
            event_id: packet.d.event_id
          }
        }

        await this.send(response)
      } break
    }
  }

  private async guildMembersRequest(packet: IpcGuildMembersRequestPacket): Promise<GuildMemberData[]> {
    const data = packet.d

    const options: RawGuildMembersFetchOptions = {
      nonce: data.nonce,
      limit: data.limit,
      guild_id: data.guild_id,
      presences: data.presences,
      query: data.query,
    }

    if (data.user_ids) {
      options.user_ids = data.user_ids
    }

    const members = await this.client.internals.actions.fetchWsGuildMembers(data.shard_id, options)

    return members.map(m => m.toJson()) as any
  }

  private cacheOperate(request: IpcCacheRequestPacket): any {
    const keyspace = request.d.keyspace, storage = request.d.storage

    switch (request.d.op) {
      case IpcCacheOpCodes.GET:
        return this.client.internals.cache.get(keyspace, storage, request.d.entity_key, request.d.key)
      case IpcCacheOpCodes.SET:
        return this.client.internals.cache.set(keyspace, storage, request.d.entity_key, request.d.policy, request.d.key, request.d.value)
      case IpcCacheOpCodes.DELETE:
        return this.client.internals.cache.delete(keyspace, storage, request.d.key)
      case IpcCacheOpCodes.SIZE:
        return this.client.internals.cache.size(keyspace, storage)
      case IpcCacheOpCodes.HAS:
        return this.client.internals.cache.has(keyspace, storage, request.d.key)
      case IpcCacheOpCodes.CLEAR:
        return this.client.internals.cache.clear(keyspace, storage)
      case IpcCacheOpCodes.COUNTS: {
        const scripts = request.d.scripts

        const predicates = scripts.map(script => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          return (value, key, provider) => {
            return eval(script + '.bind(provider)(value, key, provider)')
          }
        })

        return this.client.internals.cache.counts(keyspace, storage, request.d.entity_key, predicates)
      }
      case IpcCacheOpCodes.COUNT:
      case IpcCacheOpCodes.FILTER:
      case IpcCacheOpCodes.SWEEP:
      case IpcCacheOpCodes.MAP:
      case IpcCacheOpCodes.FIND:
      case IpcCacheOpCodes.FOREACH: {
        const script = request.d.script
        let method = 'forEach'

        switch (request.d.op) {
          case IpcCacheOpCodes.SWEEP:
            method = 'sweep'
            break
          case IpcCacheOpCodes.MAP:
            method = 'map'
            break
          case IpcCacheOpCodes.FIND:
            method = 'find'
            break
          case IpcCacheOpCodes.FILTER:
            method = 'filter'
            break
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const predicate = (value, key, provider) => {
          return eval(script + '.bind(provider)(value, key, provider)')
        }

        return this.client.internals.cache[method](keyspace, storage, request.d.entity_key, predicate)
      }
    }
  }

  private hello(packet: IpcHelloPacket, socket: any) {
    if (!packet.d || (packet.d && packet.d.id !== this.MANAGER_IPC)) {
      return this.send({ op: IpcOpCodes.INVALID_SESSION, d: { id: this.INSTANCE_IPC } }, { socket: socket })
    }

    const promise = this.bucket.get('__CONNECTION_PROMISE__')
    if (promise) {
      this.bucket.delete('__CONNECTION_PROMISE__')
      promise.res(packet)
      clearTimeout(promise.timeout)
    }

    this.managerSocket = socket

    return this.identify(packet)
  }

  private identify(packet: IpcHelloPacket) {
    const data: IpcIdentifyPacket = {
      op: IpcOpCodes.IDENTIFY,
      d: {
        id: this.INSTANCE_IPC,
        event_id: packet.d.event_id
      }
    }

    return this.send(data)
  }

  send(data: IpcPacket, options?: IpcServerSendOptions): Promise<void>
  send<P extends IpcPacket>(data: IpcPacket, options?: IpcServerSendOptions): Promise<P>
  send<P extends IpcPacket = IpcPacket>(data: IpcPacket, options: IpcServerSendOptions = {}): Promise<P | void> {
    if (typeof options !== 'object') throw new DiscordooError('LocalIpcServer#send', 'options must be object type only')
    if (!options.socket) options.socket = this.managerSocket
    if (!options.socket) throw new DiscordooError('LocalIpcServer#send', 'cannot find socket to send packet:', data)
    if (!this.server) throw new DiscordooError('LocalIpcServer#send', 'ipc server not started')

    // console.log('IPC SERVER', this.instance, 'ON SEND BEFORE PROMISE', data)
    let promise: any
    return new Promise((resolve, reject) => {
      promise = { res: resolve, rej: reject }

      if (options.waitResponse && data.d?.event_id) {
        promise.timeout = setTimeout(() => {
          this.bucket.delete(data.d.event_id)
          reject(new DiscordooError('LocalIpcServer#send', 'response time is up'))
        }, options.responseTimeout ?? 60_000)

        this.bucket.set(data.d.event_id, promise)
      }

      // console.log('IPC SERVER', this.instance, 'ON SEND AFTER PROMISE', process.hrtime.bigint())
      this.server!.emit(options.socket, RAW_IPC_EVENT, data)
      if (!options.waitResponse) resolve(void 0)
    })
  }

  generate() {
    // console.log('SERVER', this.instance)
    return DiscordooSnowflake.generate(this.instance, process.pid)
  }
}
