import { ChannelResolvable, EntitiesCacheManager, EntitiesUtil } from '@src/api'
import { AbstractChannel } from '@src/api/entities/channel/AbstractChannel'
import { Client } from '@src/core'
import { attach, channelEntityKey, DiscordooError, resolveChannelId, resolvePermissionsOverwriteToRaw } from '@src/utils'
import { GuildChannelDeleteOptions } from '@src/api/entities/channel/interfaces/GuildChannelDeleteOptions'
import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { Keyspaces } from '@src/constants'
import { AnyChannel } from '@src/api/entities/channel/interfaces/AnyChannel'
import { GuildChannelEditData } from '@src/api/entities/channel/interfaces/GuildChannelEditData'
import { RawGuildChannelEditData } from '@src/api/entities/channel/interfaces/RawGuildChannelEditData'
import { AnyGuildChannel } from '@src/api/entities/channel/interfaces/AnyGuildChannel'
import { GuildChannelResolvable } from '@src/api/entities/channel/interfaces/GuildChannelResolvable'
import { GuildChannelEditOptions } from '@src/api/entities/channel/interfaces/GuildChannelEditOptions'
import { AnyThreadChannel } from '@src/api/entities/channel/interfaces/AnyThreadChannel'
import { ThreadChannelResolvable } from '@src/api/entities/channel/interfaces/ThreadChannelResolvable'
import { ThreadChannelEditData } from '@src/api/entities/channel/interfaces/ThreadChannelEditData'
import { RawThreadChannelEditData } from '@src/api/entities/channel/interfaces/RawThreadChannelEditData'
import { ThreadChannelEditOptions } from '@src/api/entities/channel/interfaces/ThreadChannelEditOptions'
import { is } from 'typescript-is'

export class ClientChannelsManager extends EntitiesManager {
  public cache: EntitiesCacheManager<AbstractChannel>

  constructor(client: Client) {
    super(client)

    this.cache = new EntitiesCacheManager<AbstractChannel>(this.client, {
      keyspace: Keyspaces.GUILD_CHANNELS,
      storage: 'global',
      entity: channelEntityKey,
      policy: 'channels'
    })
  }

  async delete<R = AnyChannel>(channel: ChannelResolvable, options: GuildChannelDeleteOptions = {}): Promise<R | undefined> {
    const channelId = resolveChannelId(channel)

    if (!channelId) {
      throw new DiscordooError('ClientChannelsManager#delete', 'Cannot delete channel without id.')
    }

    const response = await this.client.internals.actions.deleteChannel(channelId, options.reason)

    if (response.success) {
      const AnyChannel = EntitiesUtil.get(channelEntityKey(response.result))

      if (options.patchEntity) {
        return await options.patchEntity.init(response.result) as any
      } else {
        return await new AnyChannel(this.client).init(response.result) as any
      }
    }

    return undefined
  }

  async editGuildChannel<R = AnyGuildChannel>(
    channel: GuildChannelResolvable, data: GuildChannelEditData | RawGuildChannelEditData, options: GuildChannelEditOptions = {}
  ): Promise<R | undefined> {
    const channelId = resolveChannelId(channel)

    if (!channelId) {
      throw new DiscordooError('ClientChannelsManager#editGuildChannel', 'Cannot edit guild channel without id.')
    }

    if (!data) {
      throw new DiscordooError('ClientChannelsManager#editGuildChannel', 'Cannot edit guild channel without edit data.')
    }

    const payload: RawGuildChannelEditData = {}

    attach(payload, data, [
      'name',
      'type',
      'position',
      'topic',
      'nsfw',
      [ 'rate_limit_per_user', 'rateLimitPerUser' ],
      'bitrate',
      [ 'parent_id', 'parentId' ],
      [ 'rtc_region', 'rtcRegion' ],
      [ 'video_quality_mode', 'videoQualityMode' ],
    ])

    if ('permissionOverwrites' in data) {
      if (data.permissionOverwrites?.length) {
        payload.permission_overwrites = data.permissionOverwrites.map(o => resolvePermissionsOverwriteToRaw(o))
      } else {
        payload.permission_overwrites = null
      }
    }

    if ('permission_overwrites' in data) {
      if (data.permission_overwrites?.length) {
        payload.permission_overwrites = data.permission_overwrites.map(o => resolvePermissionsOverwriteToRaw(o))
      } else {
        payload.permission_overwrites = null
      }
    }

    const response = await this.client.internals.actions.editGuildChannel(channelId, data, options.reason)

    if (response.success) {
      const AnyGuildChannel: any = EntitiesUtil.get(channelEntityKey(response.result))

      if (options.patchEntity) {
        return await options.patchEntity.init(response.result) as any
      } else {
        return await new AnyGuildChannel(this.client).init(response.result) as any
      }
    }

    return undefined
  }

  async editThreadChannel<R = AnyThreadChannel>(
    thread: ThreadChannelResolvable, data: ThreadChannelEditData | RawThreadChannelEditData, options: ThreadChannelEditOptions = {}
  ): Promise<R | undefined> {
    const channelId = resolveChannelId(thread)

    if (!channelId) {
      throw new DiscordooError('ClientChannelsManager#editGuildThread', 'Cannot edit thread channel without id.')
    }

    if (!data) {
      throw new DiscordooError('ClientChannelsManager#editGuildThread', 'Cannot edit thread channel without edit data.')
    }

    const payload: RawThreadChannelEditData = {}

    attach(payload, data, [
      'name',
      'archived',
      [ 'auto_archive_duration', 'autoArchiveDuration' ],
      'locked',
      'invitable',
      [ 'rate_limit_per_user', 'rateLimitPerUser' ],
    ])

    const response = await this.client.internals.actions.editThreadChannel(channelId, payload, options.reason)

    if (response.success) {
      const AnyThreadChannel = EntitiesUtil.get(channelEntityKey(response.result))

      if (options.patchEntity) {
        return await options.patchEntity.init(response.result) as any
      } else {
        return await new AnyThreadChannel(this.client).init(response.result) as any
      }
    }

    return undefined
  }

  async edit<R = AnyThreadChannel | AnyGuildChannel>(
    channelOrThread: GuildChannelResolvable | ThreadChannelResolvable,
    data: ThreadChannelEditData | RawThreadChannelEditData | GuildChannelEditData | RawGuildChannelEditData,
    options: ThreadChannelEditOptions | GuildChannelEditOptions
  ): Promise<R | undefined> {
    const channelId = resolveChannelId(channelOrThread)

    if (!channelId) {
      throw new DiscordooError('ClientChannelsManager#edit', 'Cannot edit channel without id.')
    }

    if (!data) {
      throw new DiscordooError('ClientChannelsManager#edit', 'Cannot edit channel without edit data.')
    }

    const isThread = is<ThreadChannelEditData | RawThreadChannelEditData>(data)

    return isThread
      ? this.editThreadChannel(channelId, data, options as ThreadChannelEditOptions)
      : this.editGuildChannel(channelId, data, options as GuildChannelEditOptions)
  }

}

