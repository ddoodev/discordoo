import ShardLike from './ShardLike'
import ShardsManager from './ShardsManager'

export default interface Shard<C> extends ShardLike {
  id: string
  connection: C
  token: string
  manager: ShardsManager
}
