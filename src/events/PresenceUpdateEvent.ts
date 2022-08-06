import { AbstractEvent } from '@src/events/AbstractEvent'
import { EventNames, Keyspaces } from '@src/constants'
import { EntitiesUtil } from '@src/api/entities/EntitiesUtil'
import { Presence, RawPresenceData, User } from '@src/api'
import { PresenceUpdateEventContext } from '@src/events/ctx'

export class PresenceUpdateEvent extends AbstractEvent<PresenceUpdateEventContext> {
  public name = EventNames.PRESENCE_UPDATE

  async execute(shardId: number, data: RawPresenceData) {

    let presence = await this.client.internals.cache.get<string, Presence>(
      Keyspaces.GUILD_PRESENCES, data.guild_id, 'Presence', data.user.id
    )

    const stored: Presence | undefined = presence ? await presence._clone() : undefined

    if (presence) {
      await presence.init(data)
    } else {
      const Presence = EntitiesUtil.get('Presence')
      presence = await new Presence(this.client).init(data)
    }

    await this.client.presences.cache.set(presence.userId, presence, { storage: presence.guildId })

    let storedUser, updatedUser
    if (data.user.username) { // user can be partial
      storedUser = await this.client.users.cache.get(presence.userId)
      const User = EntitiesUtil.get('User')
      updatedUser = storedUser ? await (await storedUser?._clone()).init(data.user) : await new User(this.client).init(data.user)

      await this.client.users.cache.set(updatedUser.id, updatedUser)
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

    this.client.emit(EventNames.PRESENCE_UPDATE, context)
    return context
  }
}
