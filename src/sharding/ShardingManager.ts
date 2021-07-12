import { TypedEmitter } from 'tiny-typed-emitter'
import { ShardingManagerEvents } from '@src/sharding/interfaces/manager/ShardingManagerEvents'
import { PartialShardingModes, ShardingModes } from '@src/core/Constants'
import { ShardingManagerOptions } from '@src/sharding/interfaces/manager/options/ShardingManagerOptions'
import { DiscordooError, DiscordooSnowflake, wait } from '@src/utils'
import { isMaster as isMainCluster } from 'cluster'
import { isMainThread } from 'worker_threads'
import { Collection } from '@src/collection'
import { ShardingClient } from '@src/sharding/ShardingClient'
import { resolveShards } from '@src/utils/resolveShards'
import { intoChunks } from '@src/utils/intoChunks'

const isMainProcess = process.send === undefined

const SpawningLoopError = new DiscordooError(
  'ShardingManager', 'spawning loop detected. sharding manager spawned in the shard. aborting'
)

export class ShardingManager extends TypedEmitter<ShardingManagerEvents> {
  public mode: ShardingModes
  public options: ShardingManagerOptions
  public id: string
  public shards: Collection<number, ShardingClient> = new Collection()

  private readonly _shards: number[]
  readonly #died: boolean = false

  constructor(options: ShardingManagerOptions) {
    super()

    if ((!isMainProcess || !isMainCluster || !isMainThread) && process.env.__DDOO_SHARDING_MANAGER_IPC_ID) {
      this.#died = true
      throw SpawningLoopError
    }

    this.mode = options.mode
    this.options = options
    this._shards = resolveShards(options.shards)

    this.id = DiscordooSnowflake.generate(DiscordooSnowflake.SHARDING_MANAGER_ID, process.pid)
  }

  async spawn() {
    if (this.#died) throw SpawningLoopError

    const shardsPerShard: number = this.options.processes?.shardsPerProcess
      || this.options.workers?.shardsPerWorker
      || this.options.clusters?.shardsPerCluster
      || 1

    const chunks = intoChunks<number>(this._shards, shardsPerShard)

    let index = 0
    for await (const shards of chunks) {
      const shard = new ShardingClient({
        shards: shards,
        file: this.options.file,
        totalShards: this._shards.length,
        mode: this.mode as unknown as PartialShardingModes,
        internalEnv: {
          SHARDING_MANAGER_IPC_ID: this.id,
          SHARDING_INSTANCE_IPC_ID: DiscordooSnowflake.generate(index, process.pid),
          SHARDING_INSTANCE_ID: index,
        }
      })

      await shard.create()
      this.shards.set(index, shard)
      await wait((shardsPerShard * 5000) + 5000)

      index++
    }
  }

}
