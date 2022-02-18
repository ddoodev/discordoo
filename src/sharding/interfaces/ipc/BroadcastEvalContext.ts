import { Client } from '@src/core'
import { ShardingManager } from '@src/sharding'

export type BroadcastEvalContext<C extends Record<string, any> = Record<string, any>> =
  C & { client: C['client'] extends Client ? C['client'] : C['client'] extends ShardingManager ? C['client'] : Client }