import { ShardingManagerOptions } from '../../../../../src/sharding'
import { PartialShardingModes } from '../../../../../src/constants'

export interface ChildShardingManagerOptions extends Omit<ShardingManagerOptions, 'machines' | 'mode'> {
  mode: PartialShardingModes
}
