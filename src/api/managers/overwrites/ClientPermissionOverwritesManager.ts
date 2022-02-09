import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { ChannelResolvable, EntitiesCacheManager, RoleResolvable, UserResolvable } from '@src/api'
import { PermissionOverwrite } from '@src/api/entities/overwrite/PermissionOverwrite'
import { Client } from '@src/core'
import { Keyspaces } from '@src/constants'
import { PermissionOverwriteResolvable } from '@src/api/entities/overwrite/interfaces/PermissionOverwriteResolvable'
import { GuildChannelResolvable } from '@src/api/entities/channel/interfaces/GuildChannelResolvable'
import { AnyGuildChannel } from '@src/api/entities/channel/interfaces/AnyGuildChannel'
import { GuildChannelEditOptions } from '@src/api/entities/channel/interfaces/GuildChannelEditOptions'
import { DiscordooError, resolveChannelId, resolvePermissionOverwriteToRaw } from '@src/utils'
import { PermissionOverwriteUpsertOptions } from '@src/api/managers/overwrites/PermissionOverwriteUpsertOptions'
import { RawPermissionOverwriteData } from '@src/api/entities/overwrite/interfaces/RawPermissionOverwriteData'
import { PermissionOverwriteEditOptions } from '@src/api/managers/overwrites/PermissionOverwriteEditOptions'
import { EntitiesUtil } from '@src/api/entities/EntitiesUtil'

export class ClientPermissionOverwritesManager extends EntitiesManager {
  public cache: EntitiesCacheManager<PermissionOverwrite>

  constructor(client: Client) {
    super(client)

    this.cache = new EntitiesCacheManager<PermissionOverwrite>(this.client, {
      keyspace: Keyspaces.CHANNEL_PERMISSIONS_OVERWRITES,
      storage: 'global',
      entity: 'PermissionOverwrite',
      policy: 'overwrites'
    })
  }

  set<R = AnyGuildChannel>(
    channel: GuildChannelResolvable, overwrites: PermissionOverwriteResolvable[] | null, options: GuildChannelEditOptions = {}
  ): Promise<R | undefined> {
    const channelId = resolveChannelId(channel)

    if (!channelId) {
      throw new DiscordooError('ClientPermissionOverwritesManager#set', 'Cannot set new overwrites without channel id.')
    }

    return this.client.channels.editGuildChannel(channelId, { permissionOverwrites: overwrites }, options)
  }

  async upsert(
    channel: GuildChannelResolvable, overwrite: PermissionOverwriteResolvable, options: PermissionOverwriteUpsertOptions = {}
  ): Promise<boolean> {
    const channelId = resolveChannelId(channel)

    if (!channelId) {
      throw new DiscordooError(
        'ClientPermissionOverwritesManager#upsert',
        'Cannot create or edit overwrite without channel id.'
      )
    }

    if (!overwrite) {
      throw new DiscordooError(
        'ClientPermissionOverwritesManager#upsert',
        'Cannot create or edit overwrite without overwrite.'
      )
    }

    const payload = resolvePermissionOverwriteToRaw(overwrite, options.existing)

    const response = await this.client.internals.actions.editGuildChannelPermissions(channelId, payload, options.reason)

    return response.success
  }

  create(channel: GuildChannelResolvable, overwrite: PermissionOverwriteResolvable, reason?: string): Promise<boolean> {
    const channelId = resolveChannelId(channel)

    if (!channelId) {
      throw new DiscordooError(
        'ClientPermissionOverwritesManager#set',
        'Cannot create overwrite without channel id.'
      )
    }

    if (!overwrite) {
      throw new DiscordooError(
        'ClientPermissionOverwritesManager#set',
        'Cannot create overwrite without overwrite.'
      )
    }

    return this.upsert(channelId, overwrite, { reason })
  }

  async edit(
    channel: GuildChannelResolvable, overwrite: PermissionOverwriteResolvable, options: PermissionOverwriteEditOptions = {}
  ): Promise<boolean> {
    const channelId = resolveChannelId(channel)

    if (!channelId) {
      throw new DiscordooError(
        'ClientPermissionOverwritesManager#edit',
        'Cannot edit overwrite without channel id.'
      )
    }

    if (!overwrite) {
      throw new DiscordooError(
        'ClientPermissionOverwritesManager#edit',
        'Cannot edit overwrite without overwrite.'
      )
    }

    let existing: PermissionOverwrite | RawPermissionOverwriteData | undefined = options.existing

    if (!options.existing) {
      let overwrites: Array<PermissionOverwrite | RawPermissionOverwriteData> = (
        await this.client.internals.cache.filter<string, PermissionOverwrite>(
          Keyspaces.CHANNEL_PERMISSIONS_OVERWRITES,
          channelId,
          'PermissionOverwrite',
          () => true,
          options.cache
        )
      ).map(v => v[1]) // FIXME: low performance. Replace to .values()

      existing = overwrites.find(o => o.id === overwrite.id)

      if (!existing) {
        const response = await this.client.internals.actions.getChannel(channelId)

        if (response.success) {
          overwrites = response.result.permission_overwrites
        }

        existing = overwrites.find(o => o.id === overwrite.id)
      }
    }

    const PermissionOverwrite = EntitiesUtil.get('PermissionOverwrite')

    if (existing && !(existing instanceof PermissionOverwrite)) {
      existing = await new PermissionOverwrite(this.client).init({ ...existing, channel: channelId })
    }

    return this.upsert(channel, overwrite, { existing, reason: options.reason })
  }

  async delete(
    channel: ChannelResolvable, userOrRoleOrOverwrite: UserResolvable | RoleResolvable | PermissionOverwriteResolvable, reason?: string
  ): Promise<boolean> {
    const channelId = resolveChannelId(channel)

    if (!channelId) {
      throw new DiscordooError(
        'ClientPermissionOverwritesManager#delete',
        'Cannot delete overwrite without channel id.'
      )
    }

    const cantOperateError = new DiscordooError(
      'ClientPermissionOverwritesManager#delete', 'Cannot delete overwrite without id.'
    )

    if (!userOrRoleOrOverwrite) throw cantOperateError

    let id: string | undefined

    // TODO: DiscordSnowflake.verify
    if (typeof userOrRoleOrOverwrite === 'string') id = userOrRoleOrOverwrite
    else id = userOrRoleOrOverwrite.id

    if (!id) throw cantOperateError

    const response = await this.client.internals.actions.deleteChannelPermissions(channelId, id, reason)

    return response.success
  }

}
