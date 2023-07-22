import { AbstractEvent } from '@src/events'
import { EventNames, otherCacheSymbol } from '@src/constants'
import { EntitiesUtil, Guild } from '@src/api'
import { GuildUpdateEventContext } from '@src/events/guild/ctx'
import { RawGuildData } from '@src/api/entities/guild/interfaces/RawGuildData'

export class GuildUpdateEvent extends AbstractEvent<GuildUpdateEventContext> {
  public readonly name = EventNames.GUILD_UPDATE

  async execute(shardId: number, data: RawGuildData) {
    const stored = await this.app.guilds.cache.get(data.id)
    const Guild = EntitiesUtil.get('Guild')

    let updated: Guild
    if (stored) {
      updated = await stored._clone().then((guild) => guild.init(data))
    } else {
      updated = await new Guild(this.app).init(data)
    }

    if (data.owner_id) {
      await this.app[otherCacheSymbol].set(data.id, { id: data.owner_id }, { storage: 'guild-owners' })
    }

    const context: GuildUpdateEventContext = {
      shardId,
      guildId: data.id,
      stored,
      updated
    }

    this.app.emit(EventNames.GUILD_UPDATE, context)
    return context
  }
}
