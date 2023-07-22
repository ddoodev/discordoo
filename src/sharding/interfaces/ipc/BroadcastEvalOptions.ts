import { BroadcastOptions } from '../../../../src/sharding/interfaces/ipc/BroadcastOptions'

/** Options for IPC eval */
export interface BroadcastEvalOptions extends BroadcastOptions {
  /**
   * Any JSON-serializable object to copy and send to eval function as argument.
   *
   * If you pass 'app' property, it will be overwritten with DiscordApplication class from the shard,
   * in witch function executes.
   * @example ```js
   * // This is correct
   * app.sharding.eval(context => {
   *   if (context.app.sharding.shards.includes(context.targetShard)) {
   *     return 'We found it!'
   *   } else {
   *     return 'Whoops, looks like this is wrong shard.'
   *   }
   * }, { context: { targetShard: 32 } })
   *
   * // This is incorrect
   * const targetShard = 32
   * app.sharding.eval(({ app }) => {
   *   if (app.sharding.shards.includes(targetShard)) { // ReferenceError: targetShard is not defined
   *     return 'We found it!'
   *   } else {
   *      return 'Whoops, looks like this is wrong shard.'
   *   }
   * })
   *
   * // This is incorrect
   * const func = ({ app }) => {
   *   return app.sharding.shards.includes(this.targetShard) // this.targetShard will be undefined
   *     ? 'We found it!'
   *     : 'Whoops, looks like this is wrong shard.'
   * }
   * app.sharding.eval(func.bind({ targetShard: 32 })
   *
   * // When passed string as script, library will add the 'context' constant to the first line of code.
   * app.sharding.eval(`
   *   context.app.sharding.shards.includes(context.targetShard)
   *     ? 'We found it!'
   *     : 'Whoops, looks like this is wrong shard.'
   * `, { context: { targetShard: 32 } })
   * ```
   * */
  context?: Record<string, any>
}