import { AbstractEvent, InviteDeleteEventContext, RawInviteDeleteEventData } from '../../../src/events'
import { EventNames } from '../../../src/constants'
import { EntitiesUtil } from '../../../src/api'

export class InviteDeleteEvent extends AbstractEvent<InviteDeleteEventContext> {
  public name = EventNames.INVITE_DELETE

  async execute(shardId: number, data: RawInviteDeleteEventData) {
    let cachedInvite = await this.app.invites.cache.get(data.code, { storage: data.guild_id ? data.guild_id : 'global' })

    if (cachedInvite) {
      await this.app.invites.cache.delete(cachedInvite.code)
    } else {
      const Invite = EntitiesUtil.get('Invite')
      cachedInvite = await new Invite(this.app).init({ ...data, guild: data.guild_id, channelId: data.channel_id })
    }

    if (cachedInvite.guildId) {
      const size = await this.app.invites.cache.size({ storage: cachedInvite.guildId })
      if (size <= 0) await this.app.invites.guilds.cache.delete(cachedInvite.guildId)
    }

    const context: InviteDeleteEventContext = {
      shardId,
      invite: cachedInvite,
      code: cachedInvite.code,
      channelId: cachedInvite.channelId,
      guildId: cachedInvite.guildId
    }

    this.app.emit(EventNames.INVITE_DELETE, context)
    return context
  }

}
