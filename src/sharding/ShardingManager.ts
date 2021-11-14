import { TypedEmitter } from 'tiny-typed-emitter'
import { ShardingManagerEvents } from '@src/sharding/interfaces/manager/ShardingManagerEvents'
import { PartialShardingModes, ShardingModes } from '@src/constants'
import { ShardingManagerOptions } from '@src/sharding/interfaces/manager/options/ShardingManagerOptions'
import { DiscordooError, DiscordooSnowflake, wait } from '@src/utils'
import { isMaster as isMainCluster } from 'cluster'
import { isMainThread } from 'worker_threads'
import { Collection } from '@discordoo/collection'
import { ShardingInstance } from '@src/sharding/ShardingInstance'
import { resolveDiscordShards } from '@src/utils/resolve'
import { intoChunks } from '@src/utils/intoChunks'
import { Final } from '@src/utils/FinalDecorator'
import { ShardingManagerInternals } from '@src/sharding/interfaces/manager/ShardingManagerInternals'
import { CompletedLocalIpcOptions } from '@src/constants/sharding/CompletedLocalIpcOptions'
import { LOCAL_IPC_DEFAULT_OPTIONS } from '@src/constants/sharding/IpcDefaultOptions'

const isMainProcess = process.send === undefined

const spawningLoopError = new DiscordooError(
  'ShardingManager', 'spawning loop detected. sharding manager spawned in the shard. aborting'
)

@Final('start')
export class ShardingManager extends TypedEmitter<ShardingManagerEvents> {
  public mode: ShardingModes
  public options: ShardingManagerOptions
  public internals: ShardingManagerInternals

  public instances: Collection<number, ShardingInstance> = new Collection()
  public shards: Collection<number, ShardingInstance> = new Collection()

  readonly #died: boolean = false
  #running = false

  constructor(options: ShardingManagerOptions) {
    super()

    if ((!isMainProcess || !isMainCluster || !isMainThread) && process.env.SHARDING_MANAGER_IPC) {
      this.#died = true
      throw spawningLoopError
    }

    this.mode = options.mode
    this.options = options

    const shards = resolveDiscordShards(options.shards),
      id = DiscordooSnowflake.generate(DiscordooSnowflake.SHARDING_MANAGER_ID, process.pid)

    this.internals = {
      id,
      shards,
      rest: {
        requests: 50,
        invalid: 10000
      }
    }
  }

  async start(): Promise<ShardingManager> {
    if (this.#died) throw spawningLoopError
    if (this.#running) throw new DiscordooError('ShardingManager#start', 'Sharding manager already running.')
    this.#running = true

    const shardsPerInstance: number = this.options.shardsPerInstance || 1

    const chunks = intoChunks<number>(this.internals.shards, shardsPerInstance)

    let index = 0
    for await (const shards of chunks) {
      const instance = new ShardingInstance(this, {
        shards: shards,
        file: this.options.file,
        totalShards: this.internals.shards.length,
        mode: this.mode as unknown as PartialShardingModes,
        internalEnv: {
          SHARDING_MANAGER_IPC: this.internals.id,
          SHARDING_INSTANCE_IPC: DiscordooSnowflake.generate(index, process.pid),
          SHARDING_INSTANCE: index,
        },
        ipc: { config: this._makeLocalIpcOptions() }
      })

      await instance.create()
      this.instances.set(index, instance)
      instance.shards.forEach(s => this.shards.set(s, instance))
      await wait(1000)

      index++
    }

    return this
  }

  private _makeLocalIpcOptions(): CompletedLocalIpcOptions {
    return Object.assign(
      {},
      LOCAL_IPC_DEFAULT_OPTIONS
    )
  }

}
