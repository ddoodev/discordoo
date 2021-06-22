import { ShardingManagerOptions } from '@src/sharding'
import { PartialShardingModes } from '@src/core/Constants'

export default interface ChildShardingManagerOptions extends Omit<ShardingManagerOptions, 'machines' | 'mode'> {
  mode: PartialShardingModes
}
