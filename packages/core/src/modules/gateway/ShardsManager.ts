import ShardLike from './ShardLike'
import GatewayModule from './GatewayModule'
import Shard from './Shard'
import events from 'events'

export default interface ShardsManager<C> extends events.EventEmitter {
  /**
   * Retrieve a representation of all shards
   */
  readonly all: ShardLike
  /**
   * Module which controls this ShardManager
   */
  module: GatewayModule<C>
  /**
   * Get specific shard by id
   *
   * @param id - shard's id
   */
  get(id: number): Shard<C> | undefined
  /**
   * Start shards following this config
   *
   * @param args - args, that this function may accept
   */
  startShards(...args: any[]): Promise<void>
}
