import { AbstractEvent } from '@src/events/AbstractEvent'
import { EventNames, Keyspaces, otherCacheSymbol } from '@src/constants'
import { EntitiesUtil } from '@src/api/entities/EntitiesUtil'
import { channelEntityKey } from '@src/utils'
import { GuildEmoji, RawAbstractThreadChannelData } from '@src/api'
import { GuildCreateEventContext } from '@src/events/guild/ctx'
import { AbstractEventContext } from '@src/events'
import { RawGuildData } from '@src/api/entities/guild/interfaces/RawGuildData'

export class GuildCreateEvent extends AbstractEvent<GuildCreateEventContext | AbstractEventContext> {
  public name = EventNames.GUILD_CREATE

  async execute(shardId: number, guild: RawGuildData & { threads?: RawAbstractThreadChannelData[] }) {

    let guildCache = await this.app.guilds.cache.get(guild.id)

    const isUnavailable = guildCache?.unavailable ?? false

    if (guildCache) {
      guildCache = await guildCache.init({ ...guild, unavailable: false })
      await this.app.guilds.cache.set(guild.id, guildCache)
    } else {
      const Guild = EntitiesUtil.get('Guild')
      guildCache = await new Guild(this.app).init(guild)
      await this.app.guilds.cache.set(guild.id, guildCache)
    }

    for await (const channelData of guild.channels) {
      let cache = await this.app.internals.cache.get(Keyspaces.Channels, guild.id, 'channelEntityKey', channelData.id)

      if (cache) {
        cache = await cache.init(channelData)
        await this.app.channels.cache.set(cache.id, cache, { storage: guild.id })
      } else {
        const Channel: any = EntitiesUtil.get(channelEntityKey(channelData))
        const channel = await new Channel(this.app).init({ ...channelData, guild_id: guild.id })
        await this.app.channels.cache.set(channel.id, channel, { storage: guild.id })
      }
    }

    for await (const channelData of guild.threads ?? []) {
      // need to duplicate this code because of the way threads are received
      let cache = await this.app.internals.cache.get(Keyspaces.Channels, guild.id, 'channelEntityKey', channelData.id)

      if (cache) {
        cache = await cache.init(channelData)
        await this.app.channels.cache.set(cache.id, cache, { storage: guild.id })
      } else {
        const Channel: any = EntitiesUtil.get(channelEntityKey(channelData))
        const channel = await new Channel(this.app).init({ ...channelData, guild_id: guild.id })
        await this.app.channels.cache.set(channel.id, channel, { storage: guild.id })
      }
    }

    for await (const memberData of guild.members) {
      let memberCache = await this.app.internals.cache.get(Keyspaces.GuildMembers, guild.id, 'GuildMember', memberData.user.id)

      if (memberCache) {
        memberCache = await memberCache.init(memberData)
        await this.app.members.cache.set(memberCache.userId, memberCache, { storage: guild.id })
      } else {
        const GuildMember = EntitiesUtil.get('GuildMember')
        const member = await new GuildMember(this.app).init({
          ...memberData, guild_id: guild.id, guild_owner: memberData.user.id === guild.owner_id
        })
        await this.app.members.cache.set(member.userId, member, { storage: guild.id })
      }

      let userCache = await this.app.users.cache.get(memberData.user.id)

      if (userCache) {
        userCache = await userCache.init(memberData.user)
        await this.app.users.cache.set(memberData.user.id, userCache)
      } else {
        const User = EntitiesUtil.get('User')
        const user = await new User(this.app).init(memberData.user)
        await this.app.users.cache.set(memberData.user.id, user)
      }
    }

    for await (const presenceData of guild.presences) {
      let cache = await this.app.internals.cache.get(Keyspaces.GuildPresences, guild.id, 'Presence', presenceData.user.id)

      if (cache) {
        cache = await cache.init(presenceData)
      } else {
        const Presence = EntitiesUtil.get('Presence')
        cache = await new Presence(this.app).init({ ...presenceData, guild_id: guild.id })
      }

      await this.app.presences.cache.set(cache.userId, cache, { storage: guild.id })
    }

    for await (const emojiData of guild.emojis) {
      let cache = await this.app.emojis.cache.get<GuildEmoji>(emojiData.id, { storage: guild.id })

      if (cache) {
        cache = await cache.init(emojiData)
      } else {
        const Emoji = EntitiesUtil.get('GuildEmoji')
        cache = await new Emoji(this.app).init({ ...emojiData, guild_id: guild.id })
      }

      await this.app.emojis.cache.set(cache.id, cache, { storage: guild.id })
    }

    for (const roleData of guild.roles) {
      let cache = await this.app.roles.cache.get(roleData.id, { storage: guild.id })

      if (cache) {
        cache = await cache.init(roleData)
      } else {
        const Role = EntitiesUtil.get('Role')
        cache = await new Role(this.app).init({ ...roleData, guild_id: guild.id })
      }

      await this.app.roles.cache.set(cache.id, cache, { storage: guild.id })
    }

    await this.app[otherCacheSymbol].set(guild.id, { id: guild.owner_id }, { storage: 'guild-owners' })

    const queue = this.app.internals.queues.ready.get(shardId)

    if (queue) {
      queue.handler(this.app, { ...queue, guild: guild.id })
      return {
        shardId,
      }
    } else {
      // emit guild create
      const context: GuildCreateEventContext = {
        guild: guildCache,
        shardId,
        guildId: guild.id,
        fromUnavailable: isUnavailable
      }

      this.app.emit('guildCreate', context)
      return context
    }
  }
}
