import { TypedEmitter } from 'tiny-typed-emitter'
import IpcServerOptions from '@src/sharding/interfaces/ipc/IpcServerOptions'
import { IPC as RawIpc, server as RawIpcServer } from 'node-ipc'
import { Collection } from '@src/collection'
import { IpcEvents, IpcOPCodes, RAW_IPC_EVENT } from '@src/core/Constants'
import { IpcPacket } from '@src/sharding'
import { DiscordooError, DiscordooSnowflake } from '@src/utils'
import IpcServerSendOptions from '@src/sharding/interfaces/ipc/IpcServerSendOptions'
import { IpcDispatchPacket, IpcHelloPacket, IpcIdentifyPacket } from '@src/sharding/interfaces/ipc/IpcPackets'

export default class IpcServer extends TypedEmitter {
  private bucket: Collection<string, any> = new Collection()
  private managerSocket: any
  private readonly managerId: string
  private readonly eventsHandler: any

  public ipc: InstanceType<typeof RawIpc>
  public server: typeof RawIpcServer
  public id: string
  public shardID: number
  public shards?: number[]

  constructor(options: IpcServerOptions) {
    super()

    this.ipc = new RawIpc()

    this.id = this.ipc.config.id = options.id
    this.managerId = options.managerId
    this.shardID = options.shardID

    this.ipc.config = Object.assign(this.ipc.config, options.config || {})
    this.server = this.ipc.server

    this.eventsHandler = (data: IpcPacket, socket: any) => {
      this.onPacket(data, socket)
    }
  }

  public serve() {
    this.server.on(RAW_IPC_EVENT, this.eventsHandler.bind(this))

    this.server.start()
  }

  public destroy() {
    this.server.off(RAW_IPC_EVENT, this.eventsHandler.bind(this))
    this.server.stop()
  }

  private onPacket(packet: IpcPacket, socket: any) {
    if (packet.d?.event_id) {
      const promise = this.bucket.get(packet.d.event_id)

      if (promise) {
        clearTimeout(promise.timeout)
        promise.res(packet)
      }
    }

    switch (packet.op) {

      case IpcOPCodes.HELLO:
        this.hello(packet as IpcHelloPacket, socket)
        break

      case IpcOPCodes.DISPATCH:
        break

    }
  }

  private hello(packet: IpcHelloPacket, socket: any) {
    if (!packet.d || (packet.d && packet.d.id !== this.managerId)) {
      return this.send({ op: IpcOPCodes.INVALID_SESSION, d: { id: this.id } }, { socket: socket })
    }

    this.managerSocket = socket
    this.shards = packet.d.shards

    this.identify()
  }

  private identify() {
    const packet: IpcIdentifyPacket = {
      op: IpcOPCodes.IDENTIFY,
      d: {
        id: this.id,
        event_id: this.generate()
      }
    }

    this.send(packet)
  }

  private dispatch(packet: IpcDispatchPacket) {
    switch (packet.t) {
      case IpcEvents.DESTROYING:
        this.destroy()
        process.exit(0)
        break
    }
  }

  public async send(data: IpcPacket, options: IpcServerSendOptions = {}) {
    if (!options.socket) options.socket = this.managerSocket
    if (!options.socket) throw new DiscordooError('IpcServer#send', 'cannot find socket to send packet:', data)

    let result: any
    return new Promise((resolve, reject) => {
      result = { res: resolve, rej: reject }

      if (options.waitResponse && data.d.event_id) {
        result.timeout = setTimeout(() => {
          reject(new DiscordooError('IpcServer#send', 'response time is up'))
        }, 60000)

        this.bucket.set(data.d.event_id, result)
      }
    })
  }

  private generate() {
    return DiscordooSnowflake.generate(this.shardID, process.pid)
  }
}
