import { ShardListResolvable } from '@src/utils'

export interface CacheManagerOperationOptions {
  shard?: ShardListResolvable | 'current' | 'all'
  storage?: string
}
