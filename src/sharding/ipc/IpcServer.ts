import { TypedEmitter } from 'tiny-typed-emitter'
import { IpcServerOptions } from '@src/sharding/interfaces/ipc/IpcServerOptions'
import { IPC as RawIpc, server as RawIpcServer } from 'node-ipc'
import { Collection } from '@src/collection'
import { IpcCacheOpCodes, IpcEvents, IpcOpCodes, RAW_IPC_EVENT } from '@src/constants'
import { IpcPacket } from '@src/sharding'
import { DiscordooError, DiscordooSnowflake } from '@src/utils'
import { IpcServerSendOptions } from '@src/sharding/interfaces/ipc/IpcServerSendOptions'
import {
  IpcCacheRequestPacket,
  IpcCacheResponsePacket,
  IpcDispatchPacket,
  IpcHelloPacket,
  IpcIdentifyPacket
} from '@src/sharding/interfaces/ipc/IpcPackets'
import { IpcServerEvents } from '@src/sharding/interfaces/ipc/IpcServerEvents'
import { Client } from '@src/core'

export class IpcServer extends TypedEmitter<IpcServerEvents> {
  private bucket: Collection = new Collection()
  private managerSocket: any
  private readonly managerIpc: string
  private readonly eventsHandler: any

  public ipc: InstanceType<typeof RawIpc>
  public server?: typeof RawIpcServer
  public instanceIpc: string
  public instance: number

  public client: Client

  constructor(client: Client, options: IpcServerOptions) {
    super()

    this.client = client
    this.ipc = new RawIpc()

    this.instanceIpc = this.ipc.config.id = options.instanceIpc
    this.managerIpc = options.managerIpc
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
        reject(new DiscordooError('IpcServer#serve', 'connection to sharding manager timed out.'))
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

      case IpcOpCodes.CACHE_OPERATE: {
        // console.log('IPC SERVER', this.instance, 'ON CACHE OPERATE', process.hrtime.bigint())
        let success = true

        // console.log('IPC SERVER', this.instance, 'ON RESULT', process.hrtime.bigint())
        const result = await this.cacheOperate(packet as IpcCacheRequestPacket)
          .catch(e => {
            success = false
            return e
          })

        // console.log('IPC SERVER', this.instance, 'ON RESPONSE', process.hrtime.bigint())
        const response: IpcCacheResponsePacket = {
          op: IpcOpCodes.CACHE_OPERATE,
          d: {
            event_id: packet.d.event_id,
            success,
            result
          }
        }

        // console.log('IPC SERVER', this.instance, 'ON CACHE OPERATE REPLY', process.hrtime.bigint())
        return this.send(response)
      }

    }
  }

  private cacheOperate(request: IpcCacheRequestPacket): any {
    const keyspace = request.d.keyspace, storage = request.d.storage

    switch (request.d.op) {
      case IpcCacheOpCodes.GET:
        return this.client.internals.cache.get(keyspace, storage, request.d.entityKey, request.d.key)
      case IpcCacheOpCodes.SET:
        return this.client.internals.cache.set(keyspace, storage, request.d.entityKey, request.d.key, request.d.value)
      case IpcCacheOpCodes.DELETE:
        return this.client.internals.cache.delete(keyspace, storage, request.d.key)
      case IpcCacheOpCodes.SIZE:
        return this.client.internals.cache.size(keyspace, storage)
      case IpcCacheOpCodes.HAS:
        return this.client.internals.cache.has(keyspace, storage, request.d.key)
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
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const predicate = (value, key, provider) => {
          return eval(script + '.bind(provider)(value, key, provider)')
        }

        const makePredicate = this.client.internals.cache[Symbol.for('_ddooMakePredicate')]

        return this.client.internals.cache[method](keyspace, storage, request.d.entityKey, makePredicate(predicate))
      }
    }
  }

  private hello(packet: IpcHelloPacket, socket: any) {
    if (!packet.d || (packet.d && packet.d.id !== this.managerIpc)) {
      return this.send({ op: IpcOpCodes.INVALID_SESSION, d: { id: this.instanceIpc } }, { socket: socket })
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
        id: this.instanceIpc,
        event_id: packet.d.event_id
      }
    }

    return this.send(data)
  }

  private dispatch(packet: IpcDispatchPacket) {
    switch (packet.t) {
      case IpcEvents.DESTROYING:
        this.destroy()
        process.exit(0)
        break
    }
  }

  send(data: IpcPacket, options?: IpcServerSendOptions): Promise<void>
  send<P extends IpcPacket>(data: IpcPacket, options?: IpcServerSendOptions): Promise<P>
  send<P extends IpcPacket = IpcPacket>(data: IpcPacket, options: IpcServerSendOptions = {}): Promise<P | void> {
    if (typeof options !== 'object') throw new DiscordooError('IpcServer#send', 'options must be object type only')
    if (!options.socket) options.socket = this.managerSocket
    if (!options.socket) throw new DiscordooError('IpcServer#send', 'cannot find socket to send packet:', data)
    if (!this.server) throw new DiscordooError('IpcServer#send', 'ipc server not started')

    // console.log('IPC SERVER', this.instance, 'ON SEND BEFORE PROMISE', process.hrtime.bigint())
    let promise: any
    return new Promise((resolve, reject) => {
      promise = { res: resolve, rej: reject }

      if (options.waitResponse && data.d?.event_id) {
        promise.timeout = setTimeout(() => {
          this.bucket.delete(data.d.event_id)
          reject(new DiscordooError('IpcServer#send', 'response time is up'))
        }, 60000)

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
