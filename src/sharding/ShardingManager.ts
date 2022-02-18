import { TypedEmitter } from 'tiny-typed-emitter'
import { ShardingManagerEvents } from '@src/sharding/interfaces/manager/ShardingManagerEvents'
import { ShardingModes } from '@src/constants'
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
import { start } from 'repl'
import { inspect } from 'util'

const isMainProcess = process.send === undefined

const spawningLoopError = new DiscordooError(
  'ShardingManager', 'spawning loop detected. sharding manager spawned in the shard. aborting'
)

@Final('start')
export class ShardingManager extends TypedEmitter<ShardingManagerEvents> {
  public readonly mode: ShardingModes
  public readonly options: ShardingManagerOptions
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
        // TODO: limits can be different
        allowed: 50,
        allowedResetAt: Date.now() + 1000,
        invalid: 10_000,
        invalidResetAt: Date.now() + 10 * 60 * 1000,
        locked: false
      }
    }

    let remaining = 10 * 60 * 1000 // 10 minutes, in ms

    /**
     * This interval will reset allowed requests/s every second
     * and also it will reset allowed invalid requests/10m every 10 minutes
     * */
    setInterval(() => {
      this.internals.rest.allowed = 50
      this.internals.rest.allowedResetAt = Date.now() + 1000
      remaining -= 1000

      if (remaining <= 0) {
        remaining = 10 * 60 * 1000 // 10 minutes, in ms
        this.internals.rest.invalid = 10_000
        this.internals.rest.invalidResetAt = Date.now() + remaining
      }
    }, 1000)
  }

  async start(): Promise<ShardingManager> {
    if (this.#died) throw spawningLoopError
    if (this.#running) throw new DiscordooError('ShardingManager#start', 'Sharding manager already running.')
    if (this.mode === ShardingModes.MACHINES) {
      throw new DiscordooError(
        'ShardingManager#start', 'Inter-machines sharding does not supported yet. Will be introduced in version 1.2'
      )
    }
    this.#running = true

    const shardsPerInstance: number = this.options.shardsPerInstance || 1

    const chunks = intoChunks<number>(this.internals.shards, shardsPerInstance)

    let index = 0
    for await (const shards of chunks) {
      let restartCount = 0

      const create = async () => {
        const instance = new ShardingInstance(this, {
          shards: shards,
          file: this.options.file,
          totalShards: this.internals.shards.length,
          mode: this.mode as any,
          internalEnv: {
            SHARDING_MANAGER_IPC: this.internals.id,
            SHARDING_INSTANCE_IPC: DiscordooSnowflake.generate(index, process.pid),
            SHARDING_INSTANCE: index,
          },
          ipc: { config: this._makeLocalIpcOptions() }
        })

        try {
          await instance.create()
          this.instances.set(index, instance)
          instance.shards.forEach(s => this.shards.set(s, instance))
          await wait(1000)
        } catch (e: any) {
          if (restartCount === 2) {
            throw e
          }

          // TODO: logger
          const err = new DiscordooError(
            'ShardingManager',
            'Looks like sharding instance',
            instance.id,
            'isn\'t started correctly.',
            '\nWe are getting error:',
            `${e?.name ?? 'Unknown Error'}: ${e?.message ?? 'Unknown Error'}`,
            (!e?.name && !e?.message) ? `Error body: ${inspect(e, { depth: 2 })}` : '',
            `\nWe will try to start it again ${2 - restartCount} more time${2 - restartCount === 1 ? '' : 's'}, then you will get an error.`
          )

          restartCount++
          console.error(err)

          await instance.kill()
            .catch(() => null)

          await create()
        }
      }

      await create()
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
