import { AbstractEvent } from '@src/events'
import { EventNames, Keyspaces, otherCacheSymbol } from '@src/constants'
import { UnavailableGuildData } from '@src/api'

export class GuildDeleteEvent extends AbstractEvent {
  public name = EventNames.GUILD_DELETE

  async execute(shardId: number, data: UnavailableGuildData) {
    let guild = await this.client.guilds.cache.get(data.id)

    if (guild && data.unavailable) {
      guild = await guild.init({ ...guild, unavailable: true })
      await this.client.guilds.cache.set(data.id, guild)
    } else if (guild) {
      // remove guild from cache if it exists and available
      await this.client.guilds.cache.delete(data.id)
    }

    if (!data.unavailable) {
      // remove all data that belongs to this guild
      // TODO: remove guild from cache fully

      await this.client.internals.cache.clear(Keyspaces.CHANNELS, data.id)
      await this.client.internals.cache.clear(Keyspaces.GUILD_PRESENCES, data.id)
      await this.client.internals.cache.clear(Keyspaces.GUILD_ROLES, data.id)
      await this.client.internals.cache.clear(Keyspaces.GUILD_EMOJIS, data.id)
      await this.client[otherCacheSymbol].delete(data.id, { storage: 'guild-owners' })
      // TODO: await this.client.internals.cache.clear(Keyspaces.GUILD_BANS, data.id)

      for await (const member of await this.client.members.cache.keys({ storage: data.id })) {
        await this.client.internals.cache.clear(Keyspaces.GUILD_MEMBER_ROLES, data.id + member)
      }

      await this.client.internals.cache.clear(Keyspaces.GUILD_MEMBERS, data.id)
    }

    this.client.emit(EventNames.GUILD_DELETE, {
      shardId,
      guildId: data.id,
      guild,
      toUnavailable: !!data.unavailable
    })
  }
}