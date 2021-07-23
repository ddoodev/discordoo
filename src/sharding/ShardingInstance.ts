import { TypedEmitter } from 'tiny-typed-emitter'
import Cluster from 'cluster'
import { Worker } from 'worker_threads'
import * as Process from 'child_process'
import { CLUSTERS_SHARDING_UNSUPPORTED_PLATFORMS, PartialShardingModes } from '@src/constants'
import { ShardingInstanceOptions } from '@src/sharding/interfaces/client/ShardingInstanceOptions'
import { ShardingInstanceCreateOptions } from '@src/sharding/interfaces/client/ShardingInstanceCreateOptions'
import { IpcClient } from '@src/sharding/ipc/IpcClient'
import { DiscordooError, wait } from '@src/utils'
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

  constructor(options: ShardingInstanceOptions) {
    super()

    this.id = options.internalEnv.SHARDING_INSTANCE
    this.ipcId = options.internalEnv.SHARDING_INSTANCE_IPC
    this.shards = options.shards
    this.mode = options.mode
    this.totalShards = options.totalShards
    this.options = options
    this.ipc = new IpcClient({
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
