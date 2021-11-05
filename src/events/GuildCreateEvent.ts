import { AbstractEvent } from '@src/events/AbstractEvent'
import { EventsNames, Keyspaces } from '@src/constants'
import { EntitiesUtil } from '@src/api/entities/EntitiesUtil'
import { channelEntityKey } from '@src/utils'

export class GuildCreateEvent extends AbstractEvent {
  public name = EventsNames.GUILD_CREATE

  async execute(guild: any /* RawGuildData */) {

    for await (const channelData of guild.channels) {
      let cache = await this.client.internals.cache.get(Keyspaces.CHANNELS, guild.id, channelEntityKey, channelData.id)

      if (cache) {
        cache = await cache.init(channelData)
        await this.client.channels.cache.set(cache.id, cache, { storage: guild.id })
      } else {
        const Channel: any = EntitiesUtil.get(channelEntityKey(channelData))
        const channel = await new Channel(this.client).init(channelData)
        await this.client.channels.cache.set(channel.id, channel, { storage: guild.id })
      }
    }

    for await (const memberData of guild.members) {
      let cache = await this.client.internals.cache.get(Keyspaces.GUILD_MEMBERS, guild.id, 'GuildMember', memberData.user.id)

      if (cache) {
        cache = await cache.init(memberData)
        await this.client.members.cache.set(cache.userId, cache, { storage: guild.id })
      } else {
        const GuildMember = EntitiesUtil.get('GuildMember')
        const member = await new GuildMember(this.client).init({
          ...memberData, guild_id: guild.id, guild_owner: memberData.user.id === guild.owner_id
        })
        await this.client.members.cache.set(member.userId, member, { storage: guild.id })
      }
    }
  }
}