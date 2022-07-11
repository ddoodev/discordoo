import { AbstractEvent } from '@src/events'
import { EventNames } from '@src/constants'
import { EntitiesUtil, RawGuildMemberData } from '@src/api'

export class GuildMemberAddEvent extends AbstractEvent {
  public readonly name = EventNames.GUILD_MEMBER_ADD

  async execute(shardId: number, data: RawGuildMemberData & { guild_id: string }) {
    const GuildMember = EntitiesUtil.get('GuildMember')

    const member = await new GuildMember(this.client).init({ ...data, guild_owner: false })
    await this.client.members.cache.set(member.userId, member, { storage: member.guildId })

    // TODO: should we do something with data.user?

    this.client.emit(EventNames.GUILD_MEMBER_ADD, {
      shardId,
      guildId: data.guild_id,
      userId: data.user.id,
      member
    })
  }
}