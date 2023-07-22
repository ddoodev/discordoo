import { AbstractEvent, InviteCreateEventContext, RawInviteCreateEventData } from '@src/events'
import { EventNames } from '@src/constants'
import { EntitiesUtil } from '@src/api'

export class InviteCreateEvent extends AbstractEvent<InviteCreateEventContext> {
  public name = EventNames.INVITE_CREATE

  async execute(shardId: number, data: RawInviteCreateEventData) {
    const User = EntitiesUtil.get('User')
    let cachedInvite = await this.app.invites.cache.get(data.code, { storage: data.guild_id ? data.guild_id : 'global' })

    if (!cachedInvite) {
      const Invite = EntitiesUtil.get('Invite')
      cachedInvite = await new Invite(this.app).init({ ...data, guild: data.guild_id, channelId: data.channel_id })

      await this.app.invites.cache.set(cachedInvite.code, cachedInvite, {
        storage: cachedInvite.guildId ? cachedInvite.guildId : 'global'
      })
    }

    const context: InviteCreateEventContext = {
      shardId,
      invite: cachedInvite,
      code: data.code,
      channelId: data.channel_id,
      guildId: cachedInvite.guildId
    }

    if (data.inviter) {
      const user = await new User(this.app).init(data.inviter)
      context.inviter = user
      context.inviterId = user.id
      await this.app.users.cache.set(user.id, user)
    }

    if (data.target_user) {
      const user = await new User(this.app).init(data.target_user)
      context.targetUser = user
      context.targetUserId = user.id
      await this.app.users.cache.set(user.id, user)
    }

    this.app.emit(EventNames.INVITE_CREATE, context)
    return context
  }

}