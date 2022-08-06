import { AbstractEvent, GuildMemberUpdateEventContext } from '@src/events'
import { EventNames, otherCacheSymbol } from '@src/constants'
import { EntitiesUtil, GuildMember, RawGuildMemberData } from '@src/api'

export class GuildMemberUpdateEvent extends AbstractEvent<GuildMemberUpdateEventContext> {
  public readonly name = EventNames.GUILD_MEMBER_UPDATE

  async execute(shardId: number, data: RawGuildMemberData & { guild_id: string }) {
    const GMember = EntitiesUtil.get('GuildMember')

    const stored = await this.client.members.cache.get(data.user.id, { storage: data.guild_id })

    let updated: GuildMember
    if (stored) {
      updated = await stored._clone().then((member) => member.init(data))
    } else {
      const guildOwner = await this.client[otherCacheSymbol].get(data.guild_id, { storage: 'guild-owners' })
      const isOwner = guildOwner?.id === data.user.id

      updated = await new GMember(this.client).init({ ...data, guild_owner: isOwner })
    }

    await this.client.members.cache.set(data.user.id, updated, { storage: data.guild_id })

    const context: GuildMemberUpdateEventContext = {
      shardId,
      guildId: data.guild_id,
      userId: data.user.id,
      stored,
      updated
    }

    this.client.emit(EventNames.GUILD_MEMBER_UPDATE, context)
    return context
  }
}