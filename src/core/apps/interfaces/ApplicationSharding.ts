import { DiscordApplication } from '../../../../src/core'
import { BroadcastEvalOptions } from '../../../../src/sharding/interfaces/ipc/BroadcastEvalOptions'
import { BroadcastOptions } from '../../../../src/sharding/interfaces/ipc/BroadcastOptions'
import { CompletedLocalIpcOptions } from '../../../../src/sharding/CompletedLocalIpcOptions'
import { BroadcastEvalContext } from '../../../../src/sharding'

/** Sharding application that contains useful info/methods */
export interface ApplicationSharding {
  /** Sharding options used */
  options: CompletedLocalIpcOptions

  /** DiscordApplication to which this application is attached */
  app: DiscordApplication

  /** IDs of Discord shards that this app serves. Before app.start() was called, is shards from gateway options, or [ 0 ]. */
  shards: number[]

  /**
   * The number of Discord shards that this app has,
   * regardless of the number of sharding instances or whether inter-machines sharding is used.
   * Before app.start() was called, is totalShards from gateway options, or 1.
   * */
  totalShards: number

  /** ID of the ShardingInstance that serves this app. Before app.start() was called, is 0. */
  instance: number

  /** Whether sharding used or not */
  active: boolean

  /** Send message to specified/all sharding instances. This message will be emitted with 'ipcMessage' event in the app. */
  send(message: string, options?: BroadcastOptions): unknown

  /**
   * Eval script in specified/all sharding instances or sharding manager.
   *
   * Make sure that you are not accessing the external environment inside the script.
   * You are forwarding code from one process to another,
   * you cannot use anything that is declared above this function.
   *
   * `this` will be undefined, regardless of what type of script you are using.
   *
   * Always use `return` if you want return some result.
   *
   * Note that all undefined values will be replaced to null.
   *
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
   * // This is correct
   * app.sharding.eval(async context => {
   *   const member = await context.app.members.cache.has('123')
   *
   *   if (member) {
   *     return member.nick
   *   } else {
   *     return undefined // will be 'null' in the final result
   *   }
   * })
   *
   * // This is correct
   * app.sharding.eval(`
   *   const member = await context.app.members.cache.has('123')
   *
   *   if (member) {
   *     return member.nick
   *   } else {
   *     return undefined // will be 'null' in the final result
   *   }
   * `)
   *
   * // This is incorrect
   * const targetShard = 32
   * app.sharding.eval(({ app }) => {
   *   if (app.sharding.shards.includes(targetShard)) { // ReferenceError: targetShard is not defined
   *     return 'We found it!'
   *   } else {
   *     return 'Whoops, looks like this is wrong shard.'
   *   }
   * })
   *
   * // This is incorrect
   * const func = ({ app }) => {
   *   // TypeError: Cannot read property 'targetShard' of undefined
   *   return app.sharding.shards.includes(this.targetShard)
   *     ? 'We found it!'
   *     : 'Whoops, looks like this is wrong shard.'
   * }
   * app.sharding.eval(func.bind({ targetShard: 32 })
   *
   * // When passed string as script, library will add the 'context' constant to the first line of code.
   * app.sharding.eval(`
   *   return context.app.sharding.shards.includes(context.targetShard)
   *     ? 'We found it!'
   *     : 'Whoops, looks like this is wrong shard.'
   * `, { context: { targetShard: 32 } })
   * ```
   * */
  eval<R = any, C extends Record<string, any> = Record<string, any>>(
    script: string |
      ((
        context: BroadcastEvalContext<C>
      ) => any),
    options?: BroadcastEvalOptions
  ): Promise<R[]>

}