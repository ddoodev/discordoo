import { AbstractEvent } from '@src/events'
import { EventNames } from '@src/constants'
import { EntitiesUtil, RawViewableGuildData } from '@src/api'

export class GuildUpdateEvent extends AbstractEvent {
  public readonly name = EventNames.GUILD_UPDATE

  async execute(shardId: number, data: RawViewableGuildData) {
    const stored = await this.client.guilds.cache.get(data.id)
    const Guild = EntitiesUtil.get('Guild')

    let updated
    if (stored) {
      updated = await new Guild(this.client).init({ ...await stored._clone(), ...data })
    } else {
      updated = new Guild(this.client).init(data)
    }

    this.client.emit(EventNames.GUILD_UPDATE, {
      shardId,
      guildId: data.id,
      stored,
      updated
    })
  }
}