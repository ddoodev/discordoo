import { AbstractEvent } from '@src/events/AbstractEvent'
import { EventNames, Keyspaces } from '@src/constants'
import { EntitiesUtil } from '@src/api/entities/EntitiesUtil'
import { Presence, RawPresenceData } from '@src/api'

export class PresenceUpdateEvent extends AbstractEvent {
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

    let user = await this.client.users.cache.get(presence.userId)

    if (user) {
      user = await user.init(data.user)
    } else {
      const User = EntitiesUtil.get('User')
      user = await new User(this.client).init(data.user)
    }

    await this.client.users.cache.set(user.id, user)

    this.client.emit(EventNames.PRESENCE_UPDATE, {
      updated: presence,
      stored,
      user,
      userId: presence.userId,
      guildId: presence.guildId,
    })

  }
}
