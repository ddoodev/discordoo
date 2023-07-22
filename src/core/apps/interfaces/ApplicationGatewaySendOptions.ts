import { GatewaySendOptions } from '@discordoo/providers'
import { ReplaceType, ShardListResolvable } from '@src/utils'

export type ApplicationGatewaySendOptions = ReplaceType<GatewaySendOptions, 'shards', ShardListResolvable>
