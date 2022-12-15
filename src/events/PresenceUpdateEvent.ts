import { AbstractEvent } from '@src/events/AbstractEvent'
import { EventNames, Keyspaces } from '@src/constants'
import { EntitiesUtil } from '@src/api/entities/EntitiesUtil'
import { Presence, RawPresenceData, User } from '@src/api'
import { PresenceUpdateEventContext } from '@src/events/ctx'

export class PresenceUpdateEvent extends AbstractEvent<PresenceUpdateEventContext> {
  public name = EventNames.PRESENCE_UPDATE

  async execute(shardId: number, data: RawPresenceData) {

    let presence = await this.app.internals.cache.get<string, Presence>(
      Keyspaces.GuildPresences, data.guild_id, 'Presence', data.user.id
    )

    const stored: Presence | undefined = presence ? await presence._clone() : undefined

    if (presence) {
      await presence.init(data)
    } else {
      const Presence = EntitiesUtil.get('Presence')
      presence = await new Presence(this.app).init(data)
    }

    await this.app.presences.cache.set(presence.userId, presence, { storage: presence.guildId })

    let storedUser, updatedUser
    if (data.user.username) { // user can be partial
      storedUser = await this.app.users.cache.get(presence.userId)
      const User = EntitiesUtil.get('User')
      updatedUser = storedUser ? await (await storedUser?._clone())?.init(data.user) : await new User(this.app).init(data.user)

      await this.app.users.cache.set(updatedUser.id, updatedUser)
    }

    const context: PresenceUpdateEventContext = {
      updated: presence,
      stored,
      storedUser,
      updatedUser,
      userId: presence.userId,
      guildId: presence.guildId,
      shardId,
    }

    this.app.emit(EventNames.PRESENCE_UPDATE, context)
    return context
  }
}
