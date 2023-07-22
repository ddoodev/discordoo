import { DiscordooError, DiscordSnowflake, ValidationError } from '../../../../src/utils'
import { GatewayOpCodes } from '../../../../../providers/src/_index'
import { DiscordApplication } from '../../../../src/core'
import { RestApplicationActions } from '../../../../src/core/apps/actions/RestApplicationActions'
import { GuildMember, RawGuildMembersFetchOptions } from '../../../../src/api'
import { GuildMembersChunkEventContext, GuildMembersChunkHandlerContext } from '../../../../src/events'
import { is } from 'typescript-is'

export class ApplicationActions extends RestApplicationActions {
  constructor(public override app: DiscordApplication) {
    super(app)
  }

  fetchWsGuildMembers(shardId: number, options: RawGuildMembersFetchOptions): Promise<GuildMember[]> {
    if (!is<RawGuildMembersFetchOptions>(options)) {
      throw new ValidationError(undefined, 'Invalid members fetch options')._setInvalidOptions(options)
    }

    if (isNaN(shardId)) {
      throw new ValidationError(undefined, 'Invalid shardId for fetching members:', shardId)
    }

    const nonce = options.nonce ?? DiscordSnowflake.generate()

    let context: any
    return new Promise((resolve, reject) => {

      const handler = (eventContext: GuildMembersChunkEventContext, executionContext: GuildMembersChunkHandlerContext) => {
        if (eventContext.nonce === executionContext.nonce) {
          executionContext.fetched.push(eventContext.members)
          executionContext.timeout.refresh()
        }

        if (eventContext.last) {
          clearTimeout(executionContext.timeout)
          executionContext.resolve(executionContext.fetched.flat())
          return true
        }

        return executionContext
      }

      const timeout = setTimeout(() => {
        if (this.app.internals.queues.members.has(nonce)) {
          this.app.internals.queues.members.delete(nonce)
          const err = new DiscordooError(undefined, 'Guild members fetching stopped due to timeout.')
          reject(err)
        }
      }, 120_000)

      context = {
        handler,
        timeout,
        resolve,
        reject,
        nonce,
        fetched: []
      }

      this.app.internals.queues.members.set(nonce, context)
      this.app.internals.gateway.send({
        op: GatewayOpCodes.REQUEST_GUILD_MEMBERS,
        d: {
          ...options,
          nonce
        }
      }, { shards: [ shardId ] })
    })
  }
}
