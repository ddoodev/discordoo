import { GatewaySendOptions } from '../../../../../providers/src/_index'
import { ReplaceType, ShardListResolvable } from '../../../../src/utils'

export type ApplicationGatewaySendOptions = ReplaceType<GatewaySendOptions, 'shards', ShardListResolvable>
