import { ShardingManagerOptions } from '@src/sharding'
import { ChildShardingModes } from '@src/core/Constants'

export default interface ChildShardingManagerOptions extends Omit<ShardingManagerOptions, 'machines' | 'mode'> {
  mode: ChildShardingModes
}
