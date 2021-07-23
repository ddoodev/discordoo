import { ShardingModes } from '@src/constants'
import { MachinesShardingOptions } from '@src/sharding/interfaces/manager/options/MachinesShardingOptions'
import { ProcessesShardingOptions } from '@src/sharding/interfaces/manager/options/ProcessesShardingOptions'
import { WorkersShardingOptions } from '@src/sharding/interfaces/manager/options/WorkersShardingOptions'
import { ClustersShardingOptions } from '@src/sharding/interfaces/manager/options/ClustersShardingOptions'
import { ShardListResolvable } from '@src/core/ShardListResolvable'

export interface ShardingManagerOptions {
  mode: ShardingModes
  shards: ShardListResolvable
  file: string

  shardsPerInstance?: number

  machines?: MachinesShardingOptions
  processes?: ProcessesShardingOptions
  workers?: WorkersShardingOptions
  clusters?: ClustersShardingOptions
}
