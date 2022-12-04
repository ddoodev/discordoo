import { AbstractEvent, InviteDeleteEventContext, RawInviteDeleteEventData } from '@src/events'
import { EventNames } from '@src/constants'
import { EntitiesUtil } from '@src/api'

export class InviteDeleteEvent extends AbstractEvent<InviteDeleteEventContext> {
  public name = EventNames.INVITE_DELETE

  async execute(shardId: number, data: RawInviteDeleteEventData) {
    let cachedInvite = await this.client.invites.cache.get(data.code, { storage: data.guild_id ? data.guild_id : 'global' })

    if (cachedInvite) {
      await this.client.invites.cache.delete(cachedInvite.code)
    } else {
      const Invite = EntitiesUtil.get('Invite')
      cachedInvite = await new Invite(this.client).init({ ...data, guild: data.guild_id, channelId: data.channel_id })
    }

    if (cachedInvite.guildId) {
      const size = await this.client.invites.cache.size({ storage: cachedInvite.guildId })
      if (size <= 0) await this.client.invites.guilds.cache.delete(cachedInvite.guildId)
    }

    const context: InviteDeleteEventContext = {
      shardId,
      invite: cachedInvite,
      code: cachedInvite.code,
      channelId: cachedInvite.channelId,
      guildId: cachedInvite.guildId
    }

    this.client.emit(EventNames.INVITE_DELETE, context)
    return context
  }

}
