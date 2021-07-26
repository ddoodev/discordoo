import { TypedEmitter } from 'tiny-typed-emitter'
import { ShardingManagerEvents } from '@src/sharding/interfaces/manager/ShardingManagerEvents'
import { PartialShardingModes, ShardingModes } from '@src/constants'
import { ShardingManagerOptions } from '@src/sharding/interfaces/manager/options/ShardingManagerOptions'
import { DiscordooError, DiscordooSnowflake, wait } from '@src/utils'
import { isMaster as isMainCluster } from 'cluster'
import { isMainThread } from 'worker_threads'
import { Collection } from '@src/collection'
import { ShardingInstance } from '@src/sharding/ShardingInstance'
import { resolveDiscordShards } from '@src/utils/resolveDiscordShards'
import { intoChunks } from '@src/utils/intoChunks'

const isMainProcess = process.send === undefined

const spawningLoopError = new DiscordooError(
  'ShardingManager', 'spawning loop detected. sharding manager spawned in the shard. aborting'
)

export class ShardingManager extends TypedEmitter<ShardingManagerEvents> {
  public mode: ShardingModes
  public options: ShardingManagerOptions
  public id: string
  public instances: Collection<number, ShardingInstance> = new Collection()
  public shards: Collection<number, ShardingInstance> = new Collection()

  private readonly _shards: number[]
  readonly #died: boolean = false

  constructor(options: ShardingManagerOptions) {
    super()

    if ((!isMainProcess || !isMainCluster || !isMainThread) && process.env.SHARDING_MANAGER_IPC) {
      this.#died = true
      throw spawningLoopError
    }

    this.mode = options.mode
    this.options = options
    this._shards = resolveDiscordShards(options.shards)

    this.id = DiscordooSnowflake.generate(DiscordooSnowflake.SHARDING_MANAGER_ID, process.pid)
  }

  async spawn(): Promise<ShardingManager> {
    if (this.#died) throw spawningLoopError

    const shardsPerInstance: number = this.options.shardsPerInstance || 1

    const chunks = intoChunks<number>(this._shards, shardsPerInstance)

    let index = 0
    for await (const shards of chunks) {
      const instance = new ShardingInstance(this, {
        shards: shards,
        file: this.options.file,
        totalShards: this._shards.length,
        mode: this.mode as unknown as PartialShardingModes,
        internalEnv: {
          SHARDING_MANAGER_IPC: this.id,
          SHARDING_INSTANCE_IPC: DiscordooSnowflake.generate(index, process.pid),
          SHARDING_INSTANCE: index,
        }
      })

      await instance.create()
      this.instances.set(index, instance)
      instance.shards.forEach(s => this.shards.set(s, instance))
      await wait(5000)

      index++
    }

    return this
  }

}
