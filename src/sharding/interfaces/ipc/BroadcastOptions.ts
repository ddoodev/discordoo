import { ShardListResolvable } from '@src/utils'

export interface BroadcastOptions {
  /**
   * ShardingInstance(s) to which to send message, all expect sharding manager if not specified.
   * You can also interact with sharding manager using SHARDING_MANAGER_ID variable, just pass it in this option.
   * */
  instance?: ShardListResolvable
}