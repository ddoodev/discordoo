import { ShardListResolvable } from '@src/utils'

export interface ShardingInstanceRestructureOptions {
  /** The shards that this sharding instance should serve */
  shards: ShardListResolvable
  /** Important: the number of all shards that your app uses (including all other sharding instances) */
  totalShards: number
}