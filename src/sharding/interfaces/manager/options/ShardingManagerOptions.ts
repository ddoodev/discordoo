import { ShardingManagerTypes, ShardingModes } from '@src/core/Constants'
import MachinesShardingOptions from '@src/sharding/interfaces/manager/options/MachinesShardingOptions'
import ProcessesShardingOptions from '@src/sharding/interfaces/manager/options/ProcessesShardingOptions'
import WorkersShardingOptions from '@src/sharding/interfaces/manager/options/WorkersShardingOptions'
import ClustersShardingOptions from '@src/sharding/interfaces/manager/options/ClustersShardingOptions'
import ShardListResolvable from '@src/core/ShardListResolvable'

export default interface ShardingManagerOptions {
  mode: ShardingModes
  type: ShardingManagerTypes
  shards: ShardListResolvable

  machines?: MachinesShardingOptions
  processes?: ProcessesShardingOptions
  workers?: WorkersShardingOptions
  clusters?: ClustersShardingOptions
}
