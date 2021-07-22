import { ShardListResolvable } from '@src/core'

export interface CacheManagerOperationOptions {
  shard?: ShardListResolvable | 'current' | 'all'
}
