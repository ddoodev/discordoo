import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { ChannelResolvable, EntitiesCacheManager, EntitiesUtil, RoleResolvable, UserResolvable } from '@src/api'
import { PermissionsOverwrite } from '@src/api/entities/overwrites/PermissionsOverwrite'
import { Client } from '@src/core'
import { Keyspaces } from '@src/constants'
import { PermissionsOverwriteResolvable } from '@src/api/entities/overwrites/interfaces/PermissionsOverwriteResolvable'
import { GuildChannelResolvable } from '@src/api/entities/channel/interfaces/GuildChannelResolvable'
import { AnyGuildChannel } from '@src/api/entities/channel/interfaces/AnyGuildChannel'
import { GuildChannelEditOptions } from '@src/api/entities/channel/interfaces/GuildChannelEditOptions'
import { DiscordooError, resolveChannelId, resolvePermissionsOverwriteToRaw } from '@src/utils'
import { RawGuildChannelEditData } from '@src/api/entities/channel/interfaces/RawGuildChannelEditData'
import { PermissionsOverwriteUpsertOptions } from '@src/api/managers/overwrites/PermissionsOverwriteUpsertOptions'
import { RawPermissionsOverwriteData } from '@src/api/entities/overwrites/interfaces/RawPermissionsOverwriteData'
import { PermissionsOverwriteEditOptions } from '@src/api/managers/overwrites/PermissionsOverwriteEditOptions'

export class ClientPermissionsOverwritesManager extends EntitiesManager {
  public cache: EntitiesCacheManager<PermissionsOverwrite>

  constructor(client: Client) {
    super(client)

    this.cache = new EntitiesCacheManager<PermissionsOverwrite>(this.client, {
      keyspace: Keyspaces.CHANNEL_PERMISSIONS_OVERWRITES,
      storage: 'global',
      entity: 'PermissionsOverwrite',
      policy: 'overwrites'
    })
  }

  set<R = AnyGuildChannel>(
    channel: GuildChannelResolvable, overwrites: PermissionsOverwriteResolvable[] | null, options: GuildChannelEditOptions = {}
  ): Promise<R | undefined> {
    const channelId = resolveChannelId(channel)

    if (!channelId) {
      throw new DiscordooError('ClientPermissionsOverwritesManager#set', 'Cannot set new overwrites without channel id.')
    }

    return this.client.channels.editGuildChannel(channelId, { permissionOverwrites: overwrites }, options)
  }

  async upsert(
    channel: GuildChannelResolvable, overwrite: PermissionsOverwriteResolvable, options: PermissionsOverwriteUpsertOptions = {}
  ): Promise<boolean> {
    const channelId = resolveChannelId(channel)

    if (!channelId) {
      throw new DiscordooError(
        'ClientPermissionsOverwritesManager#upsert',
        'Cannot create or edit overwrite without channel id.'
      )
    }

    if (!overwrite) {
      throw new DiscordooError(
        'ClientPermissionsOverwritesManager#upsert',
        'Cannot create or edit overwrite without overwrite.'
      )
    }

    const payload = resolvePermissionsOverwriteToRaw(overwrite, options.existing)

    const response = await this.client.internals.actions.editGuildChannelPermissions(channelId, payload, options.reason)

    return response.success
  }

  create(channel: GuildChannelResolvable, overwrite: PermissionsOverwriteResolvable, reason?: string): Promise<boolean> {
    const channelId = resolveChannelId(channel)

    if (!channelId) {
      throw new DiscordooError(
        'ClientPermissionsOverwritesManager#set',
        'Cannot create overwrite without channel id.'
      )
    }

    if (!overwrite) {
      throw new DiscordooError(
        'ClientPermissionsOverwritesManager#set',
        'Cannot create overwrite without overwrite.'
      )
    }

    return this.upsert(channelId, overwrite, { reason })
  }

  async edit(
    channel: GuildChannelResolvable, overwrite: PermissionsOverwriteResolvable, options: PermissionsOverwriteEditOptions = {}
  ): Promise<boolean> {
    const channelId = resolveChannelId(channel)

    if (!channelId) {
      throw new DiscordooError(
        'ClientPermissionsOverwritesManager#edit',
        'Cannot edit overwrite without channel id.'
      )
    }

    if (!overwrite) {
      throw new DiscordooError(
        'ClientPermissionsOverwritesManager#edit',
        'Cannot edit overwrite without overwrite.'
      )
    }

    let existing: PermissionsOverwrite | RawPermissionsOverwriteData | undefined = options.existing

    if (!options.existing) {
      let overwrites: Array<PermissionsOverwrite | RawPermissionsOverwriteData> = (
        await this.client.internals.cache.filter<string, PermissionsOverwrite>(
          Keyspaces.CHANNEL_PERMISSIONS_OVERWRITES,
          channelId,
          'PermissionsOverwrite',
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

    const PermissionsOverwrite = EntitiesUtil.get('PermissionsOverwrite')

    if (existing && !(existing instanceof PermissionsOverwrite)) {
      existing = await new PermissionsOverwrite(this.client).init({ ...existing, channel: channelId })
    }

    return this.upsert(channel, overwrite, { existing, reason: options.reason })
  }

  async delete(
    channel: ChannelResolvable, userOrRoleOrOverwrite: UserResolvable | RoleResolvable | PermissionsOverwriteResolvable, reason?: string
  ): Promise<boolean> {
    const channelId = resolveChannelId(channel)

    if (!channelId) {
      throw new DiscordooError(
        'ClientPermissionsOverwritesManager#delete',
        'Cannot delete overwrite without channel id.'
      )
    }

    const cantOperateError = new DiscordooError(
      'ClientPermissionsOverwritesManager#delete', 'Cannot delete overwrite without id.'
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
