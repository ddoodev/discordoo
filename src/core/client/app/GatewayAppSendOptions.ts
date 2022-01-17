import { GatewaySendOptions } from '@discordoo/providers'
import { ReplaceType, ShardListResolvable } from '@src/utils'

export type GatewayAppSendOptions = ReplaceType<GatewaySendOptions, 'shards', ShardListResolvable>
