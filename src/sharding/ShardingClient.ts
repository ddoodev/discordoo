import { TypedEmitter } from 'tiny-typed-emitter'
import Cluster from 'cluster'
import { Worker } from 'worker_threads'
import * as Process from 'child_process'
import { PartialShardingModes } from '@src/core/Constants'
import { ShardingClientOptions } from '@src/sharding/interfaces/client/ShardingClientOptions'
import { ShardingClientCreateOptions } from '@src/sharding/interfaces/client/ShardingClientCreateOptions'
import { IpcClient } from '@src/sharding/ipc/IpcClient'
import { DiscordooError } from '@src/utils'
import { ProcessesShardingOptions, WorkersShardingOptions } from '@src/sharding'

export class ShardingClient extends TypedEmitter {
  public id: number
  public ipcId: string
  public ipc: IpcClient
  public shards: number[]
  public mode: PartialShardingModes
  public options: ShardingClientOptions
  public totalShards: number
  public rawShard?: Cluster.Worker | Worker | Process.ChildProcess

  constructor(options: ShardingClientOptions) {
    super()

    this.id = options.internalEnv.SHARDING_INSTANCE_ID
    this.ipcId = options.internalEnv.SHARDING_INSTANCE_IPC_ID
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
      managerId: this.options.internalEnv.SHARDING_MANAGER_IPC_ID,
      totalShards: this.totalShards
    })
  }

  async create(options: ShardingClientCreateOptions = {}) {
    if (!options.timeout) options.timeout = 30000

    const env: any = {
      __DDOO_SHARDING_MANAGER_IPC_ID: this.options.internalEnv.SHARDING_MANAGER_IPC_ID,
      __DDOO_SHARDING_INSTANCE_IPC_ID: this.options.internalEnv.SHARDING_INSTANCE_IPC_ID,
      __DDOO_SHARDING_INSTANCE_ID: this.options.internalEnv.SHARDING_INSTANCE_ID,
      TOKEN: process.env.TOKEN
      // ...process.env,
    }

    switch (this.mode) {
      case PartialShardingModes.CLUSTERS: // node:internal/child_process:805 TypeError: handle.setSimultaneousAccepts is not a function
        Cluster.setupMaster({ exec: this.options.file })
        this.rawShard = Cluster.fork()
        break

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
        throw new DiscordooError('ShardingClient#create', 'unknown sharding mode:', this.mode)
    }

    return this.ipc.connect()
  }
}
