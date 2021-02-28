import ShardLike from './ShardLike'
import ShardsManager from './ShardsManager'

/**
 * Shard representation
 *
 * @template C connection type for this shard
 */
export default interface Shard extends ShardLike {
  /**
   * Id of this shard
   */
  id: number
  /**
   * Token this shard uses
   */
  token: string
  /**
   * Manager that controls this shard
   */
  manager: ShardsManager
  /**
   * Establish connection to somewhere
   */
  connect(): Promise<void> | void
}
