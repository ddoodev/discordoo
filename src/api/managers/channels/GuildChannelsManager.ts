import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import {
  ChannelResolvable,
  EntitiesCacheManager,
  ChannelDeleteOptions,
  GuildChannelCreateData,
  RawGuildChannelCreateData,
  ThreadChannelCreateData, RawThreadChannelCreateData, RawThreadChannelWithMessageCreateData
} from '@src/api'
import { AnyGuildChannel } from '@src/api/entities/channel/interfaces/AnyGuildChannel'
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
import { RestEligibleDiscordApplication } from '@src/core/apps/AnyDiscordApplication'

export class GuildChannelsManager extends EntitiesManager {
  public cache: EntitiesCacheManager<AnyGuildChannel>
  public guildId: string

  constructor(app: RestEligibleDiscordApplication, data: GuildChannelsManagerData) {
    super(app)

    const id = resolveGuildId(data.guild)
    if (!id) throw new DiscordooError('GuildChannelsManager', 'Cannot operate without guild id provided.')
    this.guildId = id

    this.cache = new EntitiesCacheManager<AnyGuildChannel>(this.app, {
      keyspace: Keyspaces.Channels,
      storage: this.guildId,
      entity: 'channelEntityKey',
      policy: 'channels'
    })
  }

  async create<R = AnyGuildChannel>(
    data: GuildChannelCreateData | RawGuildChannelCreateData,
    options?: { reason?: string }
  ): Promise<R | undefined>
  async create<R = AnyThreadChannel>(
    data: ThreadChannelCreateData
      | RawThreadChannelCreateData
      | RawThreadChannelWithMessageCreateData,
    options: { channel: GuildChannelResolvable; reason?: string }
  ): Promise<R | undefined>
  async create<R = AnyThreadChannel | AnyGuildChannel>(
    data: GuildChannelCreateData
      | RawGuildChannelCreateData
      | ThreadChannelCreateData
      | RawThreadChannelCreateData
      | RawThreadChannelWithMessageCreateData,
    options?: { channel?: GuildChannelResolvable; reason?: string }
  ): Promise<R | undefined> {
    if (options && 'channel' in options && options.channel) {
      return this.createThreadChannel(options.channel, data as any, options.reason)
    }

    return this.createChannel(data as any, options?.reason)
  }

  async createChannel<R = AnyGuildChannel>(
    data: GuildChannelCreateData | RawGuildChannelCreateData,
    reason?: string
  ): Promise<R | undefined> {
    return this.app.channels.createGuildChannel(this.guildId, data, reason)
  }

  async createThreadChannel<R = AnyThreadChannel>(
    channel: GuildChannelResolvable,
    data: ThreadChannelCreateData | RawThreadChannelCreateData | RawThreadChannelWithMessageCreateData,
    reason?: string
  ): Promise<R | undefined> {
    return this.app.channels.createThreadChannel(channel, data, reason)
  }

  async delete<R = AnyGuildChannel>(channel: ChannelResolvable, options: ChannelDeleteOptions = {}): Promise<R | undefined> {
    return this.app.channels.delete<R>(channel, options)
  }

  async edit<R = AnyGuildChannel>(
    channel: GuildChannelResolvable,
    data: GuildChannelEditData | RawGuildChannelEditData,
    options: GuildChannelEditOptions
  ): Promise<R | undefined>
  async edit<R = AnyThreadChannel>(
    channel: ThreadChannelResolvable,
    data: ThreadChannelEditData | RawThreadChannelEditData,
    options: ThreadChannelEditOptions
  ): Promise<R | undefined>
  async edit<R = AnyThreadChannel | AnyGuildChannel>(
    channel: GuildChannelResolvable | ThreadChannelResolvable,
    data: ThreadChannelEditData | RawThreadChannelEditData | GuildChannelEditData | RawGuildChannelEditData,
    options: ThreadChannelEditOptions | GuildChannelEditOptions
  ): Promise<R | undefined> {
    return this.app.channels.edit<R>(channel, data, options)
  }

  async editGuildChannel<R = AnyGuildChannel>(
    channel: GuildChannelResolvable, data: GuildChannelEditData | RawGuildChannelEditData, options: GuildChannelEditOptions = {}
  ): Promise<R | undefined> {
    return this.app.channels.editGuildChannel<R>(channel, data, options)
  }

  async editThreadChannel<R = AnyThreadChannel>(
    thread: ThreadChannelResolvable, data: ThreadChannelEditData | RawThreadChannelEditData, options: ThreadChannelEditOptions = {}
  ): Promise<R | undefined> {
    return this.app.channels.editThreadChannel<R>(thread, data, options)
  }

  async fetch<R = AnyThreadChannel | AnyGuildChannel>(
    channel: GuildChannelResolvable | ThreadChannelResolvable
  ): Promise<R | undefined> {
    return this.app.channels.fetch<R>(channel)
  }
}
