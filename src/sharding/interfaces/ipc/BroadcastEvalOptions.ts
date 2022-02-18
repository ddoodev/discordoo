import { BroadcastOptions } from '@src/sharding/interfaces/ipc/BroadcastOptions'

/** Options for IPC eval */
export interface BroadcastEvalOptions extends BroadcastOptions {
  /**
   * Any JSON-serializable object to copy and send to eval function as argument.
   *
   * If you pass 'client' property, it will be overwritten with Client class from the shard,
   * in witch function executes.
   * @example ```js
   * // This is correct
   * client.sharding.eval(context => {
   *   if (context.client.sharding.shards.includes(context.targetShard)) {
   *     return 'We found it!'
   *   } else {
   *     return 'Whoops, looks like this is wrong shard.'
   *   }
   * }, { context: { targetShard: 32 } })
   *
   * // This is incorrect
   * const targetShard = 32
   * client.sharding.eval(({ client }) => {
   *   if (client.sharding.shards.includes(targetShard)) { // ReferenceError: targetShard is not defined
   *     return 'We found it!'
   *   } else {
   *      return 'Whoops, looks like this is wrong shard.'
   *   }
   * })
   *
   * // This is incorrect
   * const func = ({ client }) => {
   *   return client.sharding.shards.includes(this.targetShard) // this.targetShard will be undefined
   *     ? 'We found it!'
   *     : 'Whoops, looks like this is wrong shard.'
   * }
   * client.sharding.eval(func.bind({ targetShard: 32 })
   *
   * // When passed string as script, library will add the 'context' constant to the first line of code.
   * client.sharding.eval(`
   *   context.client.sharding.shards.includes(context.targetShard)
   *     ? 'We found it!'
   *     : 'Whoops, looks like this is wrong shard.'
   * `, { context: { targetShard: 32 } })
   * ```
   * */
  context?: Record<string, any>
}