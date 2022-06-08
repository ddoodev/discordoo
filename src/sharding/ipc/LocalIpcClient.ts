import { TypedEmitter } from 'tiny-typed-emitter'
import { IPC as RawIpc } from 'node-ipc'
import { IpcClientOptions, IpcClientSendOptions, IpcPacket, IpcPresenceUpdatePacket, ShardingInstance } from '@src/sharding'
import { Collection } from '@discordoo/collection'
import { IpcConnectionState, IpcEvents, IpcOpCodes, RAW_IPC_EVENT, SerializeModes, SHARDING_MANAGER_ID } from '@src/constants'
import { DiscordooError, DiscordooSnowflake } from '@src/utils'
import {
  IpcBroadcastEvalRequestPacket,
  IpcBroadcastEvalResponsePacket,
  IpcCacheRequestPacket,
  IpcCacheResponsePacket,
  IpcDispatchPackets,
  IpcEmergencyGrlHitPacket,
  IpcEmergencyRestBlockPacket,
  IpcGuildMembersRequestPacket,
  IpcHelloPacket
} from '@src/sharding/interfaces/ipc/IpcPackets'
import { IpcClientEvents } from '@src/sharding/interfaces/ipc/IpcClientEvents'
import { filterAndMap } from '@src/utils/filterAndMap'
import { IpcEmergencyOpCodes } from '@src/constants/sharding/IpcEmergencyOpCodes'
import { deserializeError, serializeError } from 'serialize-error'
import { evalWithoutScopeChain } from '@src/utils/evalWithoutScopeChain'
import { fromJson, toJson } from '@src/utils/toJson'


// SHITCODE
export class LocalIpcClient extends TypedEmitter<IpcClientEvents> {
  private bucket: Collection = new Collection()
  private shardSocket: any
  private readonly INSTANCE_IPC: string
  private readonly eventsHandler: any
  private readonly MANAGER_IPC: string
  private helloInterval?: NodeJS.Timeout

  public instance: ShardingInstance
  public ipc: InstanceType<typeof RawIpc>
  public shards: number[]
  public totalShards: number

  public state: IpcConnectionState = IpcConnectionState.DISCONNECTED

  constructor(instance: ShardingInstance, options: IpcClientOptions) {
    super()

    this.instance = instance

    this.INSTANCE_IPC = options.INSTANCE_IPC
    this.shards = options.shards
    this.MANAGER_IPC = options.MANAGER_IPC
    this.totalShards = options.totalShards

    this.ipc = new RawIpc()
    this.ipc.config = Object.assign(this.ipc.config, options.config ?? {})

    this.eventsHandler = (packet: IpcPacket) => {
      this.emit('RAW', packet)
      this.onPacket(packet)
    }
  }

  public connect() {
    let promise

    this.state = IpcConnectionState.CONNECTING

    return new Promise((resolve, reject) => {
      promise = { res: resolve, rej: reject }

      promise.timeout = setTimeout(() => {
        this.ipc.config.stopRetrying = true
        this.bucket.delete(this.INSTANCE_IPC)
        const err = new DiscordooError(
          'LocalIpcClient#connect',
          'Cannot connect to the sharding instance process. Response timed out.',
          'The connection had to handle shards:', this.shards.join(', ') + '.',
          'IPC shard id:', this.INSTANCE_IPC + '.'
        )
        this.state = IpcConnectionState.DISCONNECTED
        promise.rej(err)
      }, this.shards.length * 30000)

      this.bucket.set(this.INSTANCE_IPC, promise)

      this.ipc.connectTo(this.INSTANCE_IPC, () => {
        this.ipc.of[this.INSTANCE_IPC].on(RAW_IPC_EVENT, this.eventsHandler)

        this.helloInterval = setInterval(() => {
          this.hello(this.ipc.of[this.INSTANCE_IPC])
        }, 1000)
      })
    })
  }

  public disconnect() {
    this.ipc.disconnect(this.INSTANCE_IPC)
    this.bucket = new Collection()
    this.state = IpcConnectionState.DISCONNECTED
  }

  private onPacket(packet: IpcPacket) {
    // console.log('IPC CLIENT', this.id, 'ON PACKET', process.hrtime.bigint())
    if (packet.d?.event_id) {
      const promise = this.bucket.get(packet.d.event_id)

      if (promise) {
        this.bucket.delete(packet.d.event_id)
        clearTimeout(promise.timeout)

        if (packet.op === IpcOpCodes.ERROR && packet.d.event_id === this.INSTANCE_IPC) {
          return promise.rej(deserializeError(packet.d.error))
        }

        return packet.op === IpcOpCodes.ERROR ? promise.rej(packet) : promise.res(packet)
      }
    }

    switch (packet.op) {
      case IpcOpCodes.IDENTIFY:
        this.shardSocket = this.ipc.of[packet.d.id]
        if (this.helloInterval) clearInterval(this.helloInterval)
        this.state = IpcConnectionState.CONNECTED
        break
      case IpcOpCodes.CACHE_OPERATE:
        // console.log('IPC CLIENT', this.id, 'ON CACHE OPERATE', process.hrtime.bigint())
        this.cacheOperate(packet as IpcCacheRequestPacket)
        break
      case IpcOpCodes.DISPATCH:
        this.dispatch(packet as IpcDispatchPackets)
        break
      case IpcOpCodes.EMERGENCY:
        this.emergency(packet as IpcEmergencyGrlHitPacket)
        break
    }
  }

  private emergency(packet: IpcEmergencyGrlHitPacket) {
    const now = Date.now()

    if (packet.d.block_until > now) {
      this.instance.manager.internals.rest.locked = true

      setTimeout(() => {
        this.instance.manager.internals.rest.locked = false
      }, packet.d.block_until - now)

      const request: IpcEmergencyRestBlockPacket = {
        op: IpcOpCodes.EMERGENCY,
        d: {
          op: IpcEmergencyOpCodes.GLOBAL_RATE_LIMIT_HIT,
          block_until: packet.d.block_until
        }
      }

      this.instance.manager.instances.forEach(instance => {
        instance.ipc.send(request)
      })
    }
  }

  private async dispatch(packet: IpcDispatchPackets) {
    switch (packet.t) {
      case IpcEvents.GUILD_MEMBERS_REQUEST:
        await this.guildMembersRequest(packet as IpcGuildMembersRequestPacket)
        break

      case IpcEvents.BROADCAST_EVAL: {
        const shards = (packet as IpcBroadcastEvalRequestPacket).d.shards,
          id = packet.d.event_id

        const promises: Array<undefined | Promise<any>> = shards.map(s => {
          if (s === SHARDING_MANAGER_ID) {
            const context = {
              ...fromJson((packet as IpcBroadcastEvalRequestPacket).d.context),
              client: this.instance.manager
            }

            return evalWithoutScopeChain(context, (packet as IpcBroadcastEvalRequestPacket).d.script)
              .then(r => {
                return {
                  op: IpcOpCodes.DISPATCH,
                  t: IpcEvents.BROADCAST_EVAL,
                  d: {
                    event_id: id,
                    result: toJson(r),
                  }
                }
              })
          } else {
            const shard = this.instance.manager.instances.get(s)

            if (shard) packet.d.event_id = this.generate()

            return shard?.ipc.send(packet, { waitResponse: true })
          }
        })

        await Promise.all(promises)
          .then(r => {
            r = r.filter(r => r !== undefined)

            const response: IpcBroadcastEvalResponsePacket = {
              op: IpcOpCodes.DISPATCH,
              t: IpcEvents.BROADCAST_EVAL,
              d: {
                event_id: id,
                result: r.map(p => p.d.result)
              }
            }

            this.send(response)
          })
          .catch(e => {

            let response: any

            if (e?.d?.event_id) {
              response = e
              // console.log('RESP', response)
            } else {
              response = {
                op: IpcOpCodes.ERROR,
                t: IpcEvents.BROADCAST_EVAL,
                d: {
                  result: serializeError(e)
                }
              }
            }

            response.d.event_id = id

            this.send(response)
          })
      } break

      case IpcEvents.MESSAGE: {
        const shards = filterAndMap<any, ShardingInstance>(
          packet.d.shards,
          id => this.instance.manager.instances.has(id),
          id => this.instance.manager.instances.get(id)
        )

        shards.forEach(s => {
          s.ipc.send(packet)
        })
      } break

      case IpcEvents.REST_LIMITS_SYNC: {
        if (!this.instance.manager.internals.rest.locked) {
          this.instance.manager.internals.rest.allowed -= 1
          if (!packet.d.success) this.instance.manager.internals.rest.invalid -= 1

          if (this.instance.manager.internals.rest.invalid <= 1) {
            this.instance.manager.internals.rest.locked = true

            setTimeout(() => {
              this.instance.manager.internals.rest.locked = false
            }, this.instance.manager.internals.rest.invalidResetAt - Date.now())

            const request: IpcEmergencyRestBlockPacket = {
              op: IpcOpCodes.EMERGENCY,
              d: {
                op: IpcEmergencyOpCodes.INVALID_REQUEST_LIMIT_ALMOST_REACHED,
                block_until: this.instance.manager.internals.rest.invalidResetAt
              }
            }

            this.instance.manager.instances.forEach(instance => {
              instance.ipc.send(request)
            })

          } else if (this.instance.manager.internals.rest.allowed <= 1) {
            this.instance.manager.internals.rest.locked = true

            setTimeout(() => {
              this.instance.manager.internals.rest.locked = false
            }, this.instance.manager.internals.rest.allowedResetAt - Date.now())

            const request: IpcEmergencyRestBlockPacket = {
              op: IpcOpCodes.EMERGENCY,
              d: {
                op: IpcEmergencyOpCodes.GLOBAL_RATE_LIMIT_ALMOST_REACHED,
                block_until: this.instance.manager.internals.rest.allowedResetAt
              }
            }

            this.instance.manager.instances.forEach(instance => {
              instance.ipc.send(request)
            })
          }
        }
      } break

      case IpcEvents.PRESENCE_UPDATE: {
        const instances: [ ShardingInstance, number[] ][] = []

        packet.d.shards.forEach(s => {
          const instance = this.instance.manager.shards.get(s)

          if (instance) {
            const index = instances.findIndex(g => g[0].id === instance?.id)
            const group: [ ShardingInstance, number[] ] = index > -1 ? instances[index] : [ instance, [ s ] ]

            if (index > -1) {
              group[1].push(s)
              instances[index] = group
            } else {
              instances.push(group)
            }
          }
        })

        instances.forEach(([ instance, shards ]) => {
          const data: IpcPresenceUpdatePacket = {
            op: IpcOpCodes.DISPATCH,
            t: IpcEvents.PRESENCE_UPDATE,
            d: {
              event_id: this.generate(),
              shards,
              presence: packet.d.presence
            }
          }

          instance.ipc.send(data)
        })

      } break
    }
  }

  private async guildMembersRequest(packet: IpcGuildMembersRequestPacket) {
    const shard = this.instance.manager.shards.get(packet.d.shard_id),
      id = packet.d.event_id

    if (shard) {
      packet.d.event_id = this.generate()
      const result: any = await shard.ipc.send(packet, { waitResponse: true, responseTimeout: 100_000 })

      result.d.event_id = id

      await this.send(result)
    }
  }

  private async cacheOperate(packet: IpcCacheRequestPacket) {
    const shards: number[] = packet.d.shards,
      id = packet.d.event_id

    // console.log('IPC CLIENT', this.instance.id, 'ON PROMISES', process.hrtime.bigint())
    const promises: Array<undefined | Promise<any>> = shards.map(s => {
      const shard = this.instance.manager.shards.get(s)

      if (shard) packet.d.event_id = this.generate()

      return shard?.ipc.send(packet, { waitResponse: true })
    })

    // console.log('IPC CLIENT', this.instance.id, 'ON RESPONSES', process.hrtime.bigint())
    const responses: Array<IpcCacheResponsePacket | undefined> = await Promise.all(promises)

    // console.log('IPC CLIENT', this.instance.id, 'ON SUCCESS', process.hrtime.bigint())
    const success = responses.some(r => r?.d.success)
    let result

    if ('serialize' in packet.d && packet.d.serialize !== undefined) {
      // console.log('IPC CLIENT', this.instance.id, 'ON SERIALIZE', process.hrtime.bigint())
      result = this.serializeResponses(
        responses.map(r => r?.d.success ? r?.d.result : undefined).filter(r => r ?? false), // filter undefined/null
        packet.d.serialize
      )
    } else {
      result = responses.map(r => r?.d.result)
    }

    // console.log('IPC CLIENT', this.instance.id, 'ON CACHE OPERATE REPLY', process.hrtime.bigint())
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
        return replies.find(r => r !== undefined && r !== null)
      case SerializeModes.ARRAY:
        return replies.flat()
      case SerializeModes.NUMBERS_ARRAY: {
        return replies.reduce((prev, curr) => {
          if (!prev.length) return curr
          else return prev.map((x, i) => x + (curr[i] ?? 0))
        }, [])
      }
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
        id: this.MANAGER_IPC,
        event_id: this.generate(),
        heartbeat_interval: 5000,
        shards: this.shards,
        total_shards: this.totalShards
      }
    }

    this.send(data, { connection })
  }

  // won't be used until best times
  // private sendHeartbeat() {
  //   const data: IpcHeartbeatPacket = {
  //     op: IpcOpCodes.HEARTBEAT,
  //     d: {
  //       id: this.MANAGER_IPC,
  //       event_id: this.generate()
  //     }
  //   }
  //
  //   this.send(data)
  // }

  public send(data: IpcPacket, options: IpcClientSendOptions = {}) {
    if (typeof options !== 'object') throw new DiscordooError('LocalIpcClient#send', 'options must be object type only')
    if (!options.connection) options.connection = this.shardSocket
    if (!options.connection) throw new DiscordooError('LocalIpcClient#send', 'cannot find socket to send packet:', data)

    let promise: any
    return new Promise((resolve, reject) => {
      promise = { res: resolve, rej: reject }

      if (options.waitResponse && data.d?.event_id) {
        promise.timeout = setTimeout(() => {
          reject(new DiscordooError('LocalIpcClient#send', 'response time is up'))
        }, options.responseTimeout ?? 60_000)

        this.bucket.set(data.d.event_id, promise)
      }

      options.connection.emit(RAW_IPC_EVENT, data)
      if (!options.waitResponse) resolve(void 0)
    })
  }

  public generate() {
    // console.log('CLIENT', this.id)
    return DiscordooSnowflake.generate(this.instance.id, process.pid)
  }
}
