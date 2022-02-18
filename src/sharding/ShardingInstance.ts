import { ShardingInstanceCreateOptions } from '@src/sharding/interfaces/client/ShardingInstanceCreateOptions'
import { ShardingInstanceOptions } from '@src/sharding/interfaces/client/ShardingInstanceOptions'
import { CLUSTERS_SHARDING_UNSUPPORTED_PLATFORMS, IpcConnectionState, IpcEvents, IpcOpCodes, PartialShardingModes } from '@src/constants'
import { ShardingManager } from '@src/sharding/ShardingManager'
import { LocalIpcClient } from '@src/sharding/ipc/LocalIpcClient'
import { TypedEmitter } from 'tiny-typed-emitter'
import { DiscordooError, DiscordooSnowflake, resolveDiscordooShards, resolveDiscordShards, ValidationError, wait } from '@src/utils'
import Process, { ChildProcess } from 'child_process'
import { Worker } from 'worker_threads'
import Cluster from 'cluster'
import os from 'os'
import { deserializeError, serializeError } from 'serialize-error'
import {
  BroadcastEvalContext,
  BroadcastEvalOptions,
  IpcBroadcastEvalRequestPacket, IpcMessagePacket,
  IpcRestructuringRequestPacket,
  ShardingInstanceRestructureOptions
} from '@src/sharding/interfaces'
import { is } from 'typescript-is'
import { Client } from '@src/core'
import { fromJson, toJson } from '@src/utils/toJson'

export class ShardingInstance extends TypedEmitter {
  public id: number
  public ipcId: string
  public ipc: LocalIpcClient
  public shards: number[]
  public mode: PartialShardingModes
  public options: ShardingInstanceOptions
  public totalShards: number
  public rawShard?: Cluster.Worker | Worker | ChildProcess
  public manager: ShardingManager

  #running = false

  constructor(manager: ShardingManager, options: ShardingInstanceOptions) {
    super()

    this.manager = manager

    this.id = options.internalEnv.SHARDING_INSTANCE
    this.ipcId = options.internalEnv.SHARDING_INSTANCE_IPC
    this.shards = options.shards
    this.mode = options.mode
    this.totalShards = options.totalShards
    this.options = options

    this.ipc = new LocalIpcClient(this, {
      INSTANCE_IPC: this.ipcId,
      tls: options.ipc?.tls,
      config: options.ipc?.config,
      shards: this.shards,
      MANAGER_IPC: this.options.internalEnv.SHARDING_MANAGER_IPC,
      totalShards: this.totalShards
    })
  }

  get running() {
    return this.#running
  }

  async kill(): Promise<this> {
    if (!this.#running) return this

    // TODO: should be in LocalIpcClient
    await this.ipc.send({
      op: IpcOpCodes.DISPATCH,
      t: IpcEvents.DESTROYING,
      d: {
        event_id: this.ipc.generate()
      }
    }, { waitResponse: true, responseTimeout: 500 })
      .catch(() => {
        this.ipc.disconnect()

        switch (this.mode) {
          case PartialShardingModes.CLUSTERS:
            (this.rawShard as Cluster.Worker).kill()
            break
          case PartialShardingModes.PROCESSES:
            (this.rawShard as ChildProcess).kill()
            break
          case PartialShardingModes.WORKERS:
            (this.rawShard as Worker).terminate()
            break
        }
      })
      .finally(() => {
        this.ipc.disconnect()
      })

    this.#running = false

    return this
  }

  message(msg: string): this {
    if (!is<string>(msg)) {
      throw new ValidationError('ShardingInstance', 'Cannot send anything expect string as messages.')
    }

    const request: IpcMessagePacket = {
      op: IpcOpCodes.DISPATCH,
      t: IpcEvents.MESSAGE,
      d: {
        event_id: this.ipc.generate(),
        message: msg,
        from: DiscordooSnowflake.SHARDING_MANAGER_ID
      }
    }

    void this.ipc.send(request)
    return this
  }

  async recreate(options?: ShardingInstanceCreateOptions): Promise<this> {
    if (this.#running) await this.kill()

    return this.create(options)
  }
  /*
  TODO: move to ShardingManager.restructure
  async restructure(options: ShardingInstanceRestructureOptions): Promise<this> {
    if (!is<ShardingInstanceRestructureOptions>(options)) {
      throw new ValidationError(
        'ShardingInstance#restructure',
        `Invalid restructuring options (Sharding instance ${this.id})`
      )._setInvalidOptions(options)
    }

    const shards = resolveDiscordShards(options.shards)

    const request: IpcRestructuringRequestPacket = {
      op: IpcOpCodes.DISPATCH,
      t: IpcEvents.RESTRUCTURING,
      d: {
        event_id: this.ipc.generate(),
        shards,
        total_shards: options.totalShards
      }
    }

    // TODO: should be in LocalIpcClient
    await this.ipc.send(request, { responseTimeout: shards.length * 30000, waitResponse: true })
      .catch(e => {
        throw e?.d?.result ? deserializeError(e.d.result) : e
      })

    this.options.shards = shards
    this.options.totalShards = options.totalShards
    this.manager.shards.map((v, k) => shards.includes(k) ? this : v)

    return this
  }
   */

  /**
   * Eval script inside this sharding instance.
   * */
  async eval<R = any, C extends Record<string, any> = Record<string, any>>(
    script: string | ((context: BroadcastEvalContext<C>) => any),
    options?: BroadcastEvalOptions
  ): Promise<R[]> {
    const context = {
      ...options?.context ? toJson(options?.context) : {}
    }

    const type = typeof script

    if (type !== 'string' && type !== 'function') {
      throw new DiscordooError('ClientShardingApplication#eval', 'Script to eval must be function or string.')
    }

    const func = type === 'string'
      ? `(async (context) => { ${script} })`
      : `(${script})`

    const request: IpcBroadcastEvalRequestPacket = {
      op: IpcOpCodes.DISPATCH,
      t: IpcEvents.BROADCAST_EVAL,
      d: {
        event_id: this.ipc.generate(),
        script: func,
        shards: resolveDiscordooShards({ shards: this.shards, totalShards: this.totalShards }, options?.instance ?? 'current'),
        context,
      }
    }

    const shards = request.d.shards

    const promises: Array<undefined | Promise<any>> = shards.map(s => {
      const shard = this.manager.instances.get(s)

      if (shard) request.d.event_id = this.ipc.generate()

      return shard?.ipc.send(request, { waitResponse: true })
    })

    return Promise.all(promises)
      .then(r => {
        r = r.filter(r => r !== undefined)
        return fromJson(r.map(p => p.d.result))
      })
      .catch(p => {
        throw p.d?.result ? deserializeError(p.d.result) : p
      })
  }

  async create(options: ShardingInstanceCreateOptions = {}): Promise<this> {
    if (this.#running) throw new DiscordooError('ShardingInstance#create', 'Sharding instance', this.id, 'already running.')
    this.#running = true
    // TODO: timeout does not affect
    if (!options.timeout) options.timeout = this.options.shards.length * 30000

    const env: any = {
      ...process.env,
      ...this.options.internalEnv,
    }

    switch (this.mode) {
      case PartialShardingModes.CLUSTERS: {
        const platform = os.platform()

        if (CLUSTERS_SHARDING_UNSUPPORTED_PLATFORMS.includes(platform as any)) {
          throw new DiscordooError(
            'ShardingInstance#create',
            '[UNSUPPORTED PLATFORM]',
            'cannot use sharding mode "clusters" on the os that does not support unix sockets (windows is not supported)'
          )
        }

        Cluster.setupMaster({ exec: this.options.file })
        this.rawShard = Cluster.fork(env)
      } break

      case PartialShardingModes.PROCESSES:
        this.rawShard = Process.fork(
          this.options.file,
          undefined,
          { env, ...this.options.spawnOptions }
        )
        break

      case PartialShardingModes.WORKERS:
        this.rawShard = new Worker(
          this.options.file,
          { env, ...this.options.spawnOptions }
        )
        break

      default:
        throw new DiscordooError('ShardingInstance#create', 'unknown sharding mode:', this.mode)
    }

    this.rawShard.on('exit', this._onExit.bind(this))

    await wait(3000) // wait before start sending IpcHello, because instance requires some time to start
    await this.ipc.connect()
    return this
  }

  private _onExit() {
    this.#running = false

    if (this.ipc.state !== IpcConnectionState.DISCONNECTED) {
      this.ipc.disconnect()
    }

    this.rawShard = undefined
  }
}
