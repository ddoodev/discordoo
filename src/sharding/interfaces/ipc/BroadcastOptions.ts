import { ShardListResolvable } from '@src/utils'

export interface BroadcastOptions {
  /** ShardingInstance(s) to which to send this message, all if not specified */
  instance?: ShardListResolvable
}