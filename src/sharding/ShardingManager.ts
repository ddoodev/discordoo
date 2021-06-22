import { TypedEmitter } from 'tiny-typed-emitter'
import ShardingManagerEvents from '@src/sharding/interfaces/manager/ShardingManagerEvents'
import { PartialShardingModes, ShardingManagerTypes, ShardingModes } from '@src/core/Constants'
import ShardingManagerOptions from '@src/sharding/interfaces/manager/options/ShardingManagerOptions'
import { DiscordooError, DiscordooSnowflake } from '@src/utils'
import { isMaster as isMainCluster } from 'cluster'
import { isMainThread } from 'worker_threads'
import { Collection } from '@src/collection'
import ShardingClient from '@src/sharding/ShardingClient'
import ShardListResolvable from '@src/core/ShardListResolvable'
const isMainProcess = process.send === undefined

const SpawningLoopError = new DiscordooError(
  'ShardingManager', 'spawning loop detected. sharding manager spawned in the shard. aborting'
)

export default class ShardingManager extends TypedEmitter<ShardingManagerEvents> {
  public type: ShardingManagerTypes
  public mode: ShardingModes
  public options: ShardingManagerOptions
  public id: string
  public shards: Collection<number, ShardingClient> = new Collection()

  private _shards: ShardListResolvable

  readonly #died: boolean = false

  constructor(options: ShardingManagerOptions) {
    super()

    if ((!isMainProcess || !isMainCluster || !isMainThread) && process.env.__DDOO_SHARDING_MANAGER_IPC_IDENTIFIER) {
      this.#died = true
      throw SpawningLoopError
    }

    this.type = options.type
    this.mode = options.mode
    this.options = options
    this._shards = options.shards

    this.id = DiscordooSnowflake.generate(DiscordooSnowflake.SHARDING_MANAGER_ID, process.pid)
  }

  async spawn() {
    if (this.#died) throw SpawningLoopError;

    (this._shards as number[]).forEach(shardID => {
      const shard = new ShardingClient({
        file: this.options.file,
        shards: [ shardID ],
        mode: PartialShardingModes.PROCESSES,
        totalShards: 1,
        env: {
          SHARDING_MANAGER_IPC_IDENTIFIER: this.id,
          SHARD_ID: shardID,
          SHARD_IPC_IDENTIFIER: DiscordooSnowflake.generate(shardID, process.pid)
        }
      })

      this.shards.set(shardID, shard)
      shard.create()
    })
  }

}
