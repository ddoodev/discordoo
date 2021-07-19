import { TypedEmitter } from 'tiny-typed-emitter'
import { IpcServerOptions } from '@src/sharding/interfaces/ipc/IpcServerOptions'
import { IPC as RawIpc, server as RawIpcServer } from 'node-ipc'
import { Collection } from '@src/collection'
import { IpcEvents, IpcOpCodes, RAW_IPC_EVENT } from '@src/core/Constants'
import { IpcPacket } from '@src/sharding'
import { DiscordooError, DiscordooSnowflake } from '@src/utils'
import { IpcServerSendOptions } from '@src/sharding/interfaces/ipc/IpcServerSendOptions'
import { IpcDispatchPacket, IpcHelloPacket, IpcIdentifyPacket } from '@src/sharding/interfaces/ipc/IpcPackets'
import { IpcServerEvents } from '@src/sharding/interfaces/ipc/IpcServerEvents'

export class IpcServer extends TypedEmitter<IpcServerEvents> {
  private bucket: Collection<string, any> = new Collection()
  private managerSocket: any
  private readonly managerId: string
  private readonly eventsHandler: any

  public ipc: InstanceType<typeof RawIpc>
  public server?: typeof RawIpcServer
  public id: string
  public shardID: number
  public shards?: number[]
  public totalShards?: number

  constructor(options: IpcServerOptions) {
    super()

    this.ipc = new RawIpc()

    this.id = this.ipc.config.id = options.id
    this.managerId = options.managerIpcId
    this.shardID = options.shardId

    this.ipc.config = Object.assign(this.ipc.config, options.config ?? {})

    this.eventsHandler = (data: IpcPacket, socket: any) => {
      if (this.listeners('RAW').length) this.emit('RAW', data)
      this.onPacket(data, socket)
    }
  }

  public async serve() {
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

  public destroy() {
    if (!this.server) return

    this.server.off(RAW_IPC_EVENT, this.eventsHandler)
    this.server.stop()
    this.server = undefined
  }

  private onPacket(packet: IpcPacket, socket: any) {
    if (packet.d?.event_id) {
      const promise = this.bucket.get(packet.d.event_id)

      if (promise) {
        this.bucket.delete(packet.d.event_id)
        clearTimeout(promise.timeout)
        promise.res(packet)
      }
    }

    switch (packet.op) {

      case IpcOpCodes.HELLO:
        this.hello(packet as IpcHelloPacket, socket)
        break

      case IpcOpCodes.DISPATCH:
        break

    }
  }

  private hello(packet: IpcHelloPacket, socket: any) {
    if (!packet.d || (packet.d && packet.d.id !== this.managerId)) {
      return this.send({ op: IpcOpCodes.INVALID_SESSION, d: { id: this.id } }, { socket: socket })
    }

    const promise = this.bucket.get('__CONNECTION_PROMISE__')
    if (promise) {
      this.bucket.delete('__CONNECTION_PROMISE__')
      promise.res(void 0)
      clearTimeout(promise.timeout)
    }

    this.managerSocket = socket
    this.shards = packet.d.shards
    this.totalShards = packet.d.total_shards

    this.identify(packet)
  }

  private identify(packet: IpcHelloPacket) {
    const data: IpcIdentifyPacket = {
      op: IpcOpCodes.IDENTIFY,
      d: {
        id: this.id,
        event_id: packet.d.event_id
      }
    }

    this.send(data)
  }

  private dispatch(packet: IpcDispatchPacket) {
    switch (packet.t) {
      case IpcEvents.DESTROYING:
        this.destroy()
        process.exit(0)
        break
    }
  }

  public send(data: IpcPacket, options: IpcServerSendOptions = {}) {
    if (typeof options !== 'object') throw new DiscordooError('IpcServer#send', 'options must be object type only')
    if (!options.socket) options.socket = this.managerSocket
    if (!options.socket) throw new DiscordooError('IpcServer#send', 'cannot find socket to send packet:', data)
    if (!this.server) throw new DiscordooError('IpcServer#sebd', 'ipc server not started')

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

      this.server!.emit(options.socket, RAW_IPC_EVENT, data)
      if (!options.waitResponse) resolve(void 0)
    })
  }

  private generate() {
    console.log('SERVER', this.shardID)
    return DiscordooSnowflake.generate(this.shardID, process.pid)
  }
}
