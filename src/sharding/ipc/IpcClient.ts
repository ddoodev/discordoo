import { TypedEmitter } from 'tiny-typed-emitter'
import { IPC as RawIpc } from 'node-ipc'
import { IpcClientOptions, IpcClientSendOptions, IpcPacket } from '@src/sharding'
import { Collection } from '@src/collection'
import { IpcOPCodes, RAW_IPC_EVENT } from '@src/core/Constants'
import { DiscordooError, DiscordooSnowflake } from '@src/utils'
import { IpcHeartbeatPacket, IpcHelloPacket } from '@src/sharding/interfaces/ipc/IpcPackets'
import { IpcClientEvents } from '@src/sharding/interfaces/ipc/IpcClientEvents'

export class IpcClient extends TypedEmitter<IpcClientEvents> {
  private bucket: Collection<string, any> = new Collection()
  private shardSocket: any
  private readonly shardIpcId: string
  private readonly eventsHandler: any
  private readonly managerId: string
  private helloInterval?: NodeJS.Timeout

  public ipc: InstanceType<typeof RawIpc>
  public shards: number[]
  public id: number
  public totalShards: number

  constructor(options: IpcClientOptions) {
    super()

    this.shardIpcId = options.shardIpcId
    this.shards = options.shards
    this.id = options.shardId
    this.managerId = options.managerId
    this.totalShards = options.totalShards

    this.ipc = new RawIpc()
    this.ipc.config = Object.assign(this.ipc.config, options.config ?? {})

    this.eventsHandler = (packet: IpcPacket) => {
      if (this.listeners('RAW').length) this.emit('RAW', packet)
      this.onPacket(packet)
    }
  }

  public connect() {
    let promise

    return new Promise((resolve, reject) => {
      promise = { res: resolve, rej: reject }

      promise.timeout = setTimeout(() => {
        this.ipc.config.stopRetrying = true
        const err = new DiscordooError(
          'IpcClient#connect',
          'the connection timed out.',
          'the connection had to handle shards:', this.shards.join(', ') + '.',
          'inter-process communication shard identifier:', this.shardIpcId + '.',
          'ipc shard id contains:', DiscordooSnowflake.deconstruct(this.shardIpcId)
        )
        promise.rej(err)
      }, 30000)

      this.ipc.connectTo(this.shardIpcId, () => {
        this.ipc.of[this.shardIpcId].once('connect', () => {
          console.log('SHARDS', this.shards.join(', '), 'CONNECTED')
          clearTimeout(promise.timeout)
          promise.res(void 0)
        })

        this.ipc.of[this.shardIpcId].on(RAW_IPC_EVENT, this.eventsHandler)

        this.helloInterval = setInterval(() => {
          this.hello(this.ipc.of[this.shardIpcId])
        }, 1000)
      })
    })
  }

  private onPacket(packet: IpcPacket) {
    if (packet.d?.event_id) {
      const promise = this.bucket.get(packet.d.event_id)

      if (promise) {
        clearTimeout(promise.timeout)
        promise.res(packet)
      }
    }

    switch (packet.op) {
      case IpcOPCodes.IDENTIFY:
        this.shardSocket = this.ipc.of[packet.d.id]
        if (this.helloInterval) clearInterval(this.helloInterval)
        break
    }
  }

  private hello(connection: any) {
    const data: IpcHelloPacket = {
      op: IpcOPCodes.HELLO,
      d: {
        id: this.managerId,
        event_id: this.generate(),
        heartbeat_interval: 5000,
        shards: this.shards,
        total_shards: this.totalShards
      }
    }

    this.send(data, { connection: connection })
  }

  private sendHeartbeat() {
    const data: IpcHeartbeatPacket = {
      op: IpcOPCodes.HEARTBEAT,
      d: {
        id: this.managerId,
        event_id: this.generate()
      }
    }

    this.send(data)
  }

  public send(data: IpcPacket, options: IpcClientSendOptions = {}) {
    if (typeof options !== 'object') throw new DiscordooError('IpcClient#send', 'options must be object type only')
    if (!options.connection) options.connection = this.shardSocket
    if (!options.connection) throw new DiscordooError('IpcClient#send', 'cannot find socket to send packet:', data)

    let promise: any
    return new Promise((resolve, reject) => {
      promise = { res: resolve, rej: reject }

      if (options.waitResponse && data.d?.event_id) {
        promise.timeout = setTimeout(() => {
          reject(new DiscordooError('IpcClient#send', 'response time is up'))
        }, 60000)

        this.bucket.set(data.d.event_id, promise)
      }

      options.connection.emit(RAW_IPC_EVENT, data)
      if (!options.waitResponse) resolve(void 0)
    })
  }

  private generate() {
    console.log('CLIENT', this.id)
    return DiscordooSnowflake.generate(this.id, process.pid)
  }
}
