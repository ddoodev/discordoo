import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { ChannelResolvable, EntitiesCacheManager, GuildChannelDeleteOptions } from '@src/api'
import { AnyGuildChannel } from '@src/api/entities/channel/interfaces/AnyGuildChannel'
import { Client } from '@src/core'
import { GuildChannelsManagerData } from '@src/api/managers/channels/GuildChannelsManagerData'
import { DiscordooError, resolveGuildId } from '@src/utils'
import { Keyspaces } from '@src/constants'
import { GuildChannelResolvable } from '@src/api/entities/channel/interfaces/GuildChannelResolvable'
import { GuildChannelEditData } from '@src/api/entities/channel/interfaces/GuildChannelEditData'
import { RawGuildChannelEditData } from '@src/api/entities/channel/interfaces/RawGuildChannelEditData'
import { GuildChannelEditOptions } from '@src/api/entities/channel/interfaces/GuildChannelEditOptions'
import { AnyThreadChannel } from '@src/api/entities/channel/interfaces/AnyThreadChannel'
import { ThreadChannelResolvable } from '@src/api/entities/channel/interfaces/ThreadChannelResolvable'
import { ThreadChannelEditData } from '@src/api/entities/channel/interfaces/ThreadChannelEditData'
import { RawThreadChannelEditData } from '@src/api/entities/channel/interfaces/RawThreadChannelEditData'
import { ThreadChannelEditOptions } from '@src/api/entities/channel/interfaces/ThreadChannelEditOptions'

export class GuildChannelsManager extends EntitiesManager {
  public cache: EntitiesCacheManager<AnyGuildChannel>
  public guildId: string

  constructor(client: Client, data: GuildChannelsManagerData) {
    super(client)

    const id = resolveGuildId(data.guild)
    if (!id) throw new DiscordooError('GuildChannelsManager', 'Cannot operate without guild id provided.')
    this.guildId = id

    this.cache = new EntitiesCacheManager<AnyGuildChannel>(this.client, {
      keyspace: Keyspaces.CHANNELS,
      storage: this.guildId,
      entity: 'channelEntityKey',
      policy: 'channels'
    })
  }

  async delete<R = AnyGuildChannel>(channel: ChannelResolvable, options: GuildChannelDeleteOptions = {}): Promise<R | undefined> {
    return this.client.channels.delete<R>(channel, options)
  }

  async editGuildChannel<R = AnyGuildChannel>(
    channel: GuildChannelResolvable, data: GuildChannelEditData | RawGuildChannelEditData, options: GuildChannelEditOptions = {}
  ): Promise<R | undefined> {
    return this.client.channels.editGuildChannel<R>(channel, data, options)
  }

  async editThreadChannel<R = AnyThreadChannel>(
    thread: ThreadChannelResolvable, data: ThreadChannelEditData | RawThreadChannelEditData, options: ThreadChannelEditOptions = {}
  ): Promise<R | undefined> {
    return this.client.channels.editThreadChannel<R>(thread, data, options)
  }

  async edit<R = AnyThreadChannel | AnyGuildChannel>(
    channelOrThread: GuildChannelResolvable | ThreadChannelResolvable,
    data: ThreadChannelEditData | RawThreadChannelEditData | GuildChannelEditData | RawGuildChannelEditData,
    options: ThreadChannelEditOptions | GuildChannelEditOptions
  ): Promise<R | undefined> {
    return this.client.channels.edit<R>(channelOrThread, data, options)
  }


}
