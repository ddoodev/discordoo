import { TypedEmitter } from 'tiny-typed-emitter'
import ShardingManagerEvents from '@src/sharding/interfaces/manager/ShardingManagerEvents'
import { ShardingManagerTypes, ShardingModes } from '@src/core/Constants'
import ShardingManagerOptions from '@src/sharding/interfaces/manager/options/ShardingManagerOptions'
import { DiscordooSnowflake } from '@src/utils'

export default class ShardingManager extends TypedEmitter<ShardingManagerEvents> {
  public type: ShardingManagerTypes
  public mode: ShardingModes
  public options: ShardingManagerOptions
  public id: string

  constructor(options: ShardingManagerOptions) {
    super()

    this.type = options.type
    this.mode = options.mode
    this.options = options

    this.id = DiscordooSnowflake.generate(DiscordooSnowflake.SHARDING_MANAGER_ID, process.pid)
  }

}
