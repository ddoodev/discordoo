import ShardLike from './ShardLike'
import GatewayModule from './GatewayModule'
import Shard from './Shard'

export default interface ShardsManager<C> {
  readonly all: ShardLike
  module: GatewayModule
  get(id: string): Shard<C>
}
