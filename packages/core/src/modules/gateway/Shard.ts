import ShardLike from './ShardLike'
import ShardsManager from './ShardsManager'

export default interface Shard<C> extends ShardLike {
  id: number
  connection?: C
  token: string
  manager: ShardsManager<C>
  connect(): Promise<void> | void
}
