import { DiscordApplication } from '../../../../src/core'
import { ShardingManager } from '../../../../src/sharding'

export type BroadcastEvalContext<C extends Record<string, any> = Record<string, any>> =
  C & { app: C['app'] extends DiscordApplication ? C['app'] : C['app'] extends ShardingManager ? C['app'] : DiscordApplication }