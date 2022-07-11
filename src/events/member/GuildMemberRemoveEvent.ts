import { AbstractEvent } from '@src/events'
import { EventNames } from '@src/constants'
import { GuildMemberRemoveEventData } from '@src/events/member/GuildMemberRemoveEventData'

export class GuildMemberRemoveEvent extends AbstractEvent {
  public readonly name = EventNames.GUILD_MEMBER_REMOVE

  async execute(shardId: number, data: GuildMemberRemoveEventData) {
    const member = await this.client.members.cache.get(data.user.id, { storage: data.guild_id })

    if (member) {
      await this.client.members.cache.delete(data.user.id, { storage: data.guild_id })
    }

    this.client.emit(EventNames.GUILD_MEMBER_REMOVE, {
      shardId,
      guildId: data.guild_id,
      userId: data.user.id,
      member
    })
  }
}