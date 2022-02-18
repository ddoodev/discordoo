import { Client } from '@src/core'
import { BroadcastEvalOptions } from '@src/sharding/interfaces/ipc/BroadcastEvalOptions'
import { BroadcastOptions } from '@src/sharding/interfaces/ipc/BroadcastOptions'
import { CompletedLocalIpcOptions } from '@src/constants/sharding/CompletedLocalIpcOptions'
import { BroadcastEvalContext, ShardingManager } from '@src/sharding'

/** Sharding application that contains useful info/methods */
export interface ClientShardingApplication {
  /** Sharding options used */
  options: CompletedLocalIpcOptions

  /** Client to which this application is attached */
  client: Client

  /** IDs of Discord shards that this client serves. Before client.start() was called, is shards from gateway options, or [ 0 ]. */
  shards: number[]

  /**
   * The number of Discord shards that this client has,
   * regardless of the number of sharding instances or whether inter-machines sharding is used.
   * Before client.start() was called, is totalShards from gateway options, or 1.
   * */
  totalShards: number

  /** ID of the ShardingInstance that serves this client. Before client.start() was called, is 0. */
  instance: number

  /** Whether sharding used or not */
  active: boolean

  /** Send message to specified/all sharding instances. This message will be emitted with 'ipcMessage' event in the client. */
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
   * client.sharding.eval(context => {
   *   if (context.client.sharding.shards.includes(context.targetShard)) {
   *     return 'We found it!'
   *   } else {
   *     return 'Whoops, looks like this is wrong shard.'
   *   }
   * }, { context: { targetShard: 32 } })
   *
   * // This is correct
   * client.sharding.eval(async context => {
   *   const member = await context.client.members.cache.has('123')
   *
   *   if (member) {
   *     return member.nick
   *   } else {
   *     return undefined // will be 'null' in the final result
   *   }
   * })
   *
   * // This is correct
   * client.sharding.eval(`
   *   const member = await context.client.members.cache.has('123')
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
   * client.sharding.eval(({ client }) => {
   *   if (client.sharding.shards.includes(targetShard)) { // ReferenceError: targetShard is not defined
   *     return 'We found it!'
   *   } else {
   *     return 'Whoops, looks like this is wrong shard.'
   *   }
   * })
   *
   * // This is incorrect
   * const func = ({ client }) => {
   *   // TypeError: Cannot read property 'targetShard' of undefined
   *   return client.sharding.shards.includes(this.targetShard)
   *     ? 'We found it!'
   *     : 'Whoops, looks like this is wrong shard.'
   * }
   * client.sharding.eval(func.bind({ targetShard: 32 })
   *
   * // When passed string as script, library will add the 'context' constant to the first line of code.
   * client.sharding.eval(`
   *   return context.client.sharding.shards.includes(context.targetShard)
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