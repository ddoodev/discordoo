import { ShardListResolvable } from '@src/core/ShardListResolvable'

export interface AbstractCacheProviderOptions {
  shard?: ShardListResolvable | 'current' | 'all'
}
