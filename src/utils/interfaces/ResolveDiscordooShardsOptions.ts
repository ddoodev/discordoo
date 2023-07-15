import { ShardListResolvable } from '@src/utils'
import { DiscordCacheApplication } from '@src/core/apps/cache/DiscordCacheApplication'

export interface ShardsInfo {
  shards: number[]
  totalShards: number
}

export interface ResolveDiscordooShardsOptions {
  app?: DiscordCacheApplication
  shardsInfo?: ShardsInfo
  shards: ShardListResolvable | 'all' | 'current'
}
