import { AbstractEvent } from '@src/events'
import { EventNames, otherCacheSymbol } from '@src/constants'
import { EntitiesUtil, Guild, RawViewableGuildData } from '@src/api'

export class GuildUpdateEvent extends AbstractEvent {
  public readonly name = EventNames.GUILD_UPDATE

  async execute(shardId: number, data: RawViewableGuildData) {
    const stored = await this.client.guilds.cache.get(data.id)
    const Guild = EntitiesUtil.get('Guild')

    let updated: Guild
    if (stored) {
      updated = await stored._clone().then((guild) => guild.init(data))
    } else {
      updated = await new Guild(this.client).init(data)
    }

    const ownerId = await this.client[otherCacheSymbol].get(data.id, { storage: 'guild-owners' })
    if (ownerId) {
      if (data.owner_id !== ownerId) {
        await this.client[otherCacheSymbol].set(data.id, { id: data.owner_id }, { storage: 'guild-owners' })
      }
    }

    this.client.emit(EventNames.GUILD_UPDATE, {
      shardId,
      guildId: data.id,
      stored,
      updated
    })
  }
}