import { ChannelResolvable, EntitiesCacheManager, GuildResolvable } from '@src/api'
import { Client } from '@src/core'
import {
  attach,
  channelEntityKey,
  DiscordooError,
  resolveChannelId,
  resolveGuildId,
  resolveMessageId,
  resolvePermissionOverwriteToRaw
} from '@src/utils'
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
import { GuildChannelCreateData } from '@src/api/entities/channel/interfaces/GuildChannelCreateData'
import { RawGuildChannelCreateData } from '@src/api/entities/channel/interfaces/RawGuildChannelCreateData'
import { ThreadChannelCreateData } from '@src/api/entities/channel/interfaces/ThreadChannelCreateData'
import { RawThreadChannelCreateData } from '@src/api/entities/channel/interfaces/RawThreadChannelCreateData'
import { RawThreadChannelWithMessageCreateData } from '@src/api/entities/channel/interfaces/RawThreadChannelWithMessageCreateData'
import { RestFailedResponse, RestSuccessfulResponse } from '@discordoo/providers'
import { EntitiesUtil } from '@src/api/entities/EntitiesUtil'

export class ClientChannelsManager extends EntitiesManager {
  public cache: EntitiesCacheManager<AnyChannel>

  constructor(client: Client) {
    super(client)

    this.cache = new EntitiesCacheManager<AnyChannel>(this.client, {
      keyspace: Keyspaces.CHANNELS,
      storage: 'global',
      entity: 'channelEntityKey',
      policy: 'channels'
    })
  }

  async createGuildChannel<R = AnyGuildChannel>(
    guild: GuildResolvable, data: GuildChannelCreateData | RawGuildChannelCreateData, reason?: string
  ): Promise<R | undefined> {
    const guildId = resolveGuildId(guild)

    if (!guildId) {
      throw new DiscordooError('ClientChannelsManager#createGuildChannel', 'Cannot create guild channel without guild id.')
    }

    if (!data) {
      throw new DiscordooError('ClientChannelsManager#createGuildChannel', 'Cannot create guild channel without create data.')
    }

    const payload: RawGuildChannelCreateData = {
      name: data.name
    }

    attach(payload, data, {
      props: [
        'type',
        'position',
        'topic',
        'nsfw',
        [ 'rate_limit_per_user', 'rateLimitPerUser' ],
        'bitrate',
        [ 'parent_id', 'parentId' ],
        [ 'rtc_region', 'rtcRegion' ],
      ]
    })

    if ('permissionOverwrites' in data) {
      if (data.permissionOverwrites?.length) {
        payload.permission_overwrites = data.permissionOverwrites.map(o => resolvePermissionOverwriteToRaw(o))
      }
    }

    if ('permission_overwrites' in data) {
      if (data.permission_overwrites?.length) {
        payload.permission_overwrites = data.permission_overwrites.map(o => resolvePermissionOverwriteToRaw(o))
      }
    }

    const response = await this.client.internals.actions.createGuildChannel(guildId, data, reason)

    if (response.success) {
      const AnyGuildChannel: any = EntitiesUtil.get(channelEntityKey(response.result))
      return await new AnyGuildChannel(this.client).init(response.result)
    }

    return undefined
  }

  async addFollower(sender: ChannelResolvable, follower: ChannelResolvable, reason?: string): Promise<boolean> {
    const senderId = resolveChannelId(sender),
      followerId = resolveChannelId(follower)

    if (!senderId) {
      throw new DiscordooError('ClientChannelsManager#addFollower', 'Cannot add channel follower without sender id.')
    }
    if (!followerId) {
      throw new DiscordooError('ClientChannelsManager#addFollower', 'Cannot add channel follower without follower id.')
    }

    const response = await this.client.internals.actions.addFollower(senderId, followerId, reason)

    return response.success
  }

  async createThreadChannel<R = AnyThreadChannel>(
    channel: GuildResolvable,
    data: ThreadChannelCreateData | RawThreadChannelCreateData | RawThreadChannelWithMessageCreateData,
    reason?: string
  ): Promise<R | undefined> {
    const channelId = resolveChannelId(channel)

    if (!channelId) {
      throw new DiscordooError('ClientChannelsManager#createThreadChannel', 'Cannot create thread channel without channel id.')
    }

    const payload: RawThreadChannelWithMessageCreateData | RawThreadChannelCreateData = {
      name: data.name
    }

    if ('message' in data && data.message) {
      const id = resolveMessageId(data.message)
      // @ts-ignore
      if (id) payload.message_id = id
    }

    attach(payload, data, {
      props: [
        [ 'auto_archive_duration', 'autoArchiveDuration' ],
        'type',
        'invitable'
      ]
    })

    let response: RestFailedResponse | RestSuccessfulResponse

    if ('message_id' in payload) {
      response = await this.client.internals.actions.createThreadWithMessage(channelId, payload, reason)
    } else {
      response = await this.client.internals.actions.createThread(channelId, payload, reason)
    }

    if (response.success) {
      const AnyThreadChannel: any = EntitiesUtil.get(channelEntityKey(response.result))
      return await new AnyThreadChannel(this.client).init(response.result)
    }

    return undefined
  }

  create<R = AnyChannel>(
    type: 'thread' | 'channel',
    channelOrGuild: ChannelResolvable | GuildResolvable,
    data: GuildChannelCreateData
      | RawGuildChannelCreateData
      | ThreadChannelCreateData
      | RawThreadChannelCreateData
      | RawThreadChannelWithMessageCreateData,
    reason?: string
  ): Promise<R | undefined> {
    if (type === 'thread') {
      return this.createThreadChannel(
        channelOrGuild as ChannelResolvable,
        data as ThreadChannelCreateData | RawThreadChannelCreateData | RawThreadChannelWithMessageCreateData,
        reason
      )
    }

    if (type === 'channel') {
      return this.createGuildChannel(
        channelOrGuild as GuildResolvable,
        data as GuildChannelCreateData | RawGuildChannelCreateData,
        reason
      )
    }

    throw new DiscordooError(
      'ClientChannelsManager#create',
      'Unknown channel type to create. Expected "channel" or "thread", received:', type
    )
  }

  async delete<R = AnyChannel>(channel: ChannelResolvable, options: GuildChannelDeleteOptions = {}): Promise<R | undefined> {
    const channelId = resolveChannelId(channel)

    if (!channelId) {
      throw new DiscordooError('ClientChannelsManager#delete', 'Cannot delete channel without id.')
    }

    const response = await this.client.internals.actions.deleteChannel(channelId, options.reason)

    if (response.success) {
      const AnyChannel: any = EntitiesUtil.get(channelEntityKey(response.result))

      if (options.patchEntity) {
        return await options.patchEntity.init({ ...response.result, deleted: true }) as any
      } else {
        return await new AnyChannel(this.client).init({ ...response.result, deleted: true }) as any
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

    attach(payload, data, {
      props: [
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
      ]
    })

    if ('permissionOverwrites' in data) {
      if (data.permissionOverwrites?.length) {
        payload.permission_overwrites = data.permissionOverwrites.map(o => resolvePermissionOverwriteToRaw(o))
      } else {
        payload.permission_overwrites = null
      }
    }

    if ('permission_overwrites' in data) {
      if (data.permission_overwrites?.length) {
        payload.permission_overwrites = data.permission_overwrites.map(o => resolvePermissionOverwriteToRaw(o))
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

    attach(payload, data, {
      props: [
        'name',
        'archived',
        [ 'auto_archive_duration', 'autoArchiveDuration' ],
        'locked',
        'invitable',
        [ 'rate_limit_per_user', 'rateLimitPerUser' ],
      ]
    })

    const response = await this.client.internals.actions.editThreadChannel(channelId, payload, options.reason)

    if (response.success) {
      const AnyThreadChannel: any = EntitiesUtil.get(channelEntityKey(response.result))

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

