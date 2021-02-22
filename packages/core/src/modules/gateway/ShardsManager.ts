import ShardLike from './ShardLike'
import GatewayModule from './GatewayModule'
import Shard from './Shard'
import events from 'events'

export default interface ShardsManager<C> extends events.EventEmitter {
  readonly all: ShardLike
  module: GatewayModule<C>
  get(id: number): Shard<C> | undefined
  startShards(...args: any[]): Promise<void>
}
