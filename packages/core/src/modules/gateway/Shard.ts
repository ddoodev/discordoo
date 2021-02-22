import ShardLike from './ShardLike'
import ShardsManager from './ShardsManager'

/**
 * Shard representation
 *
 * @template C connection type for this shard
 */
export default interface Shard<C> extends ShardLike {
  /**
   * Id of this shard
   */
  id: number
  /**
   * Connection this shard uses
   */
  connection?: C
  /**
   * Token this shard uses
   */
  token: string
  /**
   * Manager that controls this shard
   */
  manager: ShardsManager<C>
  /**
   * Establish connection to somewhere
   */
  connect(): Promise<void> | void
}
