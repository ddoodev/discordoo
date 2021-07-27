import { TypedEmitter } from 'tiny-typed-emitter'
import { IPC as RawIpc } from 'node-ipc'
import { IpcClientOptions, IpcClientSendOptions, IpcPacket, ShardingInstance } from '@src/sharding'
import { Collection } from '@src/collection'
import { IpcOpCodes, RAW_IPC_EVENT, SerializeModes } from '@src/constants'
import { DiscordooError, DiscordooSnowflake } from '@src/utils'
import { IpcCacheRequestPacket, IpcCacheResponsePacket, IpcHeartbeatPacket, IpcHelloPacket } from '@src/sharding/interfaces/ipc/IpcPackets'
import { IpcClientEvents } from '@src/sharding/interfaces/ipc/IpcClientEvents'

export class IpcClient extends TypedEmitter<IpcClientEvents> {
  private bucket: Collection = new Collection()
  private shardSocket: any
  private readonly shardIpcId: string
  private readonly eventsHandler: any
  private readonly managerId: string
  private helloInterval?: NodeJS.Timeout

  public instance: ShardingInstance
  public ipc: InstanceType<typeof RawIpc>
  public shards: number[]
  public id: number
  public totalShards: number

  constructor(instance: ShardingInstance, options: IpcClientOptions) {
    super()

    this.instance = instance

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
        this.bucket.delete(this.shardIpcId)
        const err = new DiscordooError(
          'IpcClient#connect',
          'the connection timed out.',
          'the connection had to handle shards:', this.shards.join(', ') + '.',
          'inter-process communication shard identifier:', this.shardIpcId + '.',
          'ipc shard id contains:', DiscordooSnowflake.deconstruct(this.shardIpcId)
        )
        promise.rej(err)
      }, 30000)

      this.bucket.set(this.shardIpcId, promise)

      this.ipc.connectTo(this.shardIpcId, () => {
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
        this.bucket.delete(packet.d.event_id)
        clearTimeout(promise.timeout)
        return packet.op === IpcOpCodes.ERROR ? promise.rej(packet) : promise.res(packet)
      }
    }

    switch (packet.op) {
      case IpcOpCodes.IDENTIFY:
        this.shardSocket = this.ipc.of[packet.d.id]
        if (this.helloInterval) clearInterval(this.helloInterval)
        break
      case IpcOpCodes.CACHE_OPERATE:
        this.cacheOperate(packet as IpcCacheRequestPacket)
        break
    }
  }

  private async cacheOperate(packet: IpcCacheRequestPacket) {
    const shards: number[] = packet.d.shards,
      id = packet.d.event_id

    const promises: Array<undefined | Promise<any>> = shards.map(s => {
      const shard = this.instance.manager.shards.get(s)

      if (shard) packet.d.event_id = this.generate()

      return shard?.ipc.send(packet, { waitResponse: true })
    })

    const responses: Array<IpcCacheResponsePacket | undefined> = await Promise.all(promises)

    const success = responses.some(r => r?.d.success)
    let result

    // @ts-expect-error
    if (packet.d.serialize !== undefined) {
      result = this.serializeResponses(
        responses.map(r => r?.d.success ? r?.d.result : undefined).filter(r => r ?? false), // filter undefined/null
        // @ts-expect-error
        packet.d.serialize
      )
    } else {
      result = responses.map(r => r?.d.result)
    }

    return this.send({
      op: IpcOpCodes.CACHE_OPERATE,
      d: {
        event_id: id,
        success,
        result
      }
    })
  }

  private serializeResponses(replies: any[], type: SerializeModes) {
    switch (type) {
      case SerializeModes.ANY:
        return replies.find(r => r)
      case SerializeModes.ARRAY:
        return replies.flat()
      case SerializeModes.BOOLEAN:
        return replies.find(r => r === true) ?? false
      case SerializeModes.NUMBER:
        return replies.reduce((prev, curr) => prev + curr, 0)
      default:
        return replies
    }
  }

  private hello(connection: any) {
    const data: IpcHelloPacket = {
      op: IpcOpCodes.HELLO,
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
      op: IpcOpCodes.HEARTBEAT,
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

  public generate() {
    console.log('CLIENT', this.id)
    return DiscordooSnowflake.generate(this.id, process.pid)
  }
}
