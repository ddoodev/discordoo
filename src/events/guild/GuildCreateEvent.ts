import { AbstractEvent } from '@src/events/AbstractEvent'
import { EventNames, Keyspaces, otherCacheSymbol } from '@src/constants'
import { EntitiesUtil } from '@src/api/entities/EntitiesUtil'
import { channelEntityKey } from '@src/utils'
import { GuildEmoji, RawViewableGuildData } from '@src/api'

export class GuildCreateEvent extends AbstractEvent {
  public name = EventNames.GUILD_CREATE

  async execute(shardId: number, guild: RawViewableGuildData) {

    let guildCache = await this.client.guilds.cache.get(guild.id)

    const isUnavailable = guildCache?.unavailable ?? false

    if (guildCache) {
      guildCache = await guildCache.init({ ...guild, unavailable: false })
      await this.client.guilds.cache.set(guild.id, guildCache)
    } else {
      const Guild = EntitiesUtil.get('Guild')
      guildCache = await new Guild(this.client).init(guild)
      await this.client.guilds.cache.set(guild.id, guildCache)
    }

    for await (const channelData of guild.channels) {
      let cache = await this.client.internals.cache.get(Keyspaces.CHANNELS, guild.id, 'channelEntityKey', channelData.id)

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
      let memberCache = await this.client.internals.cache.get(Keyspaces.GUILD_MEMBERS, guild.id, 'GuildMember', memberData.user.id)

      if (memberCache) {
        memberCache = await memberCache.init(memberData)
        await this.client.members.cache.set(memberCache.userId, memberCache, { storage: guild.id })
      } else {
        const GuildMember = EntitiesUtil.get('GuildMember')
        const member = await new GuildMember(this.client).init({
          ...memberData, guild_id: guild.id, guild_owner: memberData.user.id === guild.owner_id
        })
        await this.client.members.cache.set(member.userId, member, { storage: guild.id })
      }

      let userCache = await this.client.users.cache.get(memberData.user.id)

      if (userCache) {
        userCache = await userCache.init(memberData.user)
        await this.client.users.cache.set(memberData.user.id, userCache)
      } else {
        const User = EntitiesUtil.get('User')
        const user = await new User(this.client).init(memberData.user)
        await this.client.users.cache.set(memberData.user.id, user)
      }
    }

    for await (const presenceData of guild.presences) {
      let cache = await this.client.internals.cache.get(Keyspaces.GUILD_PRESENCES, guild.id, 'Presence', presenceData.user.id)

      if (cache) {
        cache = await cache.init(presenceData)
      } else {
        const Presence = EntitiesUtil.get('Presence')
        cache = await new Presence(this.client).init({ ...presenceData, guild_id: guild.id })
      }

      await this.client.presences.cache.set(cache.userId, cache, { storage: guild.id })
    }

    for await (const emojiData of guild.emojis) {
      let cache = await this.client.emojis.cache.get<GuildEmoji>(emojiData.id, { storage: guild.id })

      if (cache) {
        cache = await cache.init(emojiData)
      } else {
        const Emoji = EntitiesUtil.get('GuildEmoji')
        cache = await new Emoji(this.client).init({ ...emojiData, guild_id: guild.id })
      }

      await this.client.emojis.cache.set(cache.id, cache, { storage: guild.id })
    }

    await this.client[otherCacheSymbol].set(guild.id, { id: guild.owner_id }, { storage: 'guild-owners' })

    const queue = this.client.internals.queues.ready.get(shardId)

    if (queue) {
      queue.handler(this.client, { ...queue, guild: guild.id })
    } else {
      // emit guild create
      this.client.emit('guildCreate', {
        guild: guildCache,
        shardId,
        guildId: guild.id,
        fromUnavailable: isUnavailable
      })
    }
  }
}
