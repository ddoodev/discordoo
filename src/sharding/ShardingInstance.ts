import { ShardingInstanceCreateOptions } from '@src/sharding/interfaces/client/ShardingInstanceCreateOptions'
import { ShardingInstanceOptions } from '@src/sharding/interfaces/client/ShardingInstanceOptions'
import { CLUSTERS_SHARDING_UNSUPPORTED_PLATFORMS, PartialShardingModes } from '@src/constants'
import { ShardingManager } from '@src/sharding/ShardingManager'
import { IpcClient } from '@src/sharding/ipc/IpcClient'
import { TypedEmitter } from 'tiny-typed-emitter'
import { DiscordooError, wait } from '@src/utils'
import * as Process from 'child_process'
import { Worker } from 'worker_threads'
import Cluster from 'cluster'
import os from 'os'

export class ShardingInstance extends TypedEmitter {
  public id: number
  public ipcId: string
  public ipc: IpcClient
  public shards: number[]
  public mode: PartialShardingModes
  public options: ShardingInstanceOptions
  public totalShards: number
  public rawShard?: Cluster.Worker | Worker | Process.ChildProcess
  public manager: ShardingManager

  constructor(manager: ShardingManager, options: ShardingInstanceOptions) {
    super()

    this.manager = manager

    this.id = options.internalEnv.SHARDING_INSTANCE
    this.ipcId = options.internalEnv.SHARDING_INSTANCE_IPC
    this.shards = options.shards
    this.mode = options.mode
    this.totalShards = options.totalShards
    this.options = options

    this.ipc = new IpcClient(this, {
      shardId: this.id,
      shardIpcId: this.ipcId,
      tls: options.ipc?.tls,
      config: options.ipc?.config,
      shards: this.shards,
      managerId: this.options.internalEnv.SHARDING_MANAGER_IPC,
      totalShards: this.totalShards
    })
  }

  async create(options: ShardingInstanceCreateOptions = {}) {
    if (!options.timeout) options.timeout = 30000

    const env: any = {
      ...process.env,
      ...this.options.internalEnv,
    }

    switch (this.mode) {
      case PartialShardingModes.CLUSTERS: {
        const platform = os.platform()

        if (CLUSTERS_SHARDING_UNSUPPORTED_PLATFORMS.includes(platform)) {
          throw new DiscordooError(
            'ShardingInstance#create',
            '[UNSUPPORTED PLATFORM]',
            'cannot use sharding mode "clusters" on the os that does not supports unix sockets (windows is not supported)'
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

    await wait(3000) // wait before start sending IpcHello, because instance requires some time to start
    return this.ipc.connect()
  }
}
