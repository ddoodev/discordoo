import { AbstractChannel } from '@src/api/entities/channel/AbstractChannel'
import { AbstractGuildChannelData } from '@src/api/entities/channel/interfaces/AbstractGuildChannelData'
import { RawAbstractGuildChannelData } from '@src/api/entities/channel/interfaces/RawAbstractGuildChannelData'
import { attach, DiscordooError, resolveChannelId, resolveMemberId, resolveRoleId } from '@src/utils'
import { RawGuildChannelEditData } from '@src/api/entities/channel/interfaces/RawGuildChannelEditData'
import { GuildChannelEditData } from '@src/api/entities/channel/interfaces/GuildChannelEditData'
import { ChannelPermissionOverwritesManager } from '@src/api/managers/overwrites/ChannelPermissionOverwritesManager'
import { PermissionOverwriteResolvable } from '@src/api/entities/overwrite/interfaces/PermissionOverwriteResolvable'
import { PermissionOverwrite } from '@src/api/entities/overwrite/PermissionOverwrite'
import { GuildCategoryChannel } from '@src/api/entities/channel/GuildCategoryChannel'
import { ChannelTypes, Keyspaces, PermissionFlags } from '@src/constants'
import { CacheManagerGetOptions } from '@src/cache'
import {
  PermissionsCheckOptions,
  ReadonlyPermissions,
  Permissions,
  Role,
  GuildMember,
  RoleResolvable,
  ChannelResolvable,
  ToJsonProperties, Json
} from '@src/api'
import { GuildMemberResolvable } from '@src/api/entities/member/interfaces/GuildMemberResolvable'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'

export abstract class AbstractGuildChannel extends AbstractChannel {
  public declare type: ChannelTypes.GUILD_CATEGORY
    | ChannelTypes.GUILD_TEXT
    | ChannelTypes.GUILD_NEWS
    | ChannelTypes.GUILD_STAGE_VOICE
    | ChannelTypes.GUILD_VOICE
    | ChannelTypes.GUILD_STORE
  public declare guildId: string
  public declare name: string
  public parentId?: string
  public declare position: number
  public declare overwrites: ChannelPermissionOverwritesManager<this>

  async init(data: AbstractGuildChannelData | RawAbstractGuildChannelData, options?: EntityInitOptions): Promise<this> {
    await super.init(data, options)

    attach(this, data, {
      props: [
        'name',
        [ 'guildId', 'guild_id' ],
        [ 'parentId', 'parent_id' ],
        'position',
      ],
      disabled: options?.ignore,
      enabled: [ 'name', 'guildId', 'position' ]
    })

    // @ts-ignore
    const overwrites: PermissionOverwriteResolvable[] = data.permissionOverwrites ?? data.permission_overwrites ?? []

    if (!this.overwrites) {
      this.overwrites = new ChannelPermissionOverwritesManager<this>(this.client, {
        channel: this
      })
    }

    if (overwrites.length) {
      await this.overwrites?.cache.clear()

      for await (const data of overwrites) {
        const overwrite = await new PermissionOverwrite(this.client).init({ ...data, channel: this.id })
        await this.overwrites.cache.set(overwrite.id, overwrite)
      }
    }

    return this
  }

  async parent(options?: CacheManagerGetOptions): Promise<GuildCategoryChannel | undefined> {
    if (!this.parentId) return undefined

    return this.client.internals.cache.get(
      Keyspaces.CHANNELS,
      this.guildId,
      'GuildCategoryChannel',
      this.parentId,
      options
    )
  }

  async edit(data: RawGuildChannelEditData | GuildChannelEditData, reason?: string): Promise<this | undefined> {
    return this.client.channels.editGuildChannel(this.id, data, { reason, patchEntity: this })
  }

  setName(name: string, reason?: string) {
    return this.edit({ name }, reason)
  }

  setParent(channel: ChannelResolvable | null, reason?: string) {
    const id: string | null | undefined = channel === null ? null : resolveChannelId(channel)

    if (id === undefined) throw new DiscordooError('Channel#setParent', 'Channel must be ChannelResolvable or null.')

    return this.edit({ parentId: id }, reason)
  }

  /**
   * Calculated member permissions for this channel, includes overwrites. If overwrites are not cached, this method is useless.
   * When checkAdmin option provided, tries to find member or guild in cache to check ownership.
   * */
  async memberPermissions(member: GuildMemberResolvable, options?: PermissionsCheckOptions): Promise<ReadonlyPermissions> {
    const id = resolveMemberId(member)

    if (!id) throw new DiscordooError('Channel#memberPermissions', 'Cannot check member permissions without member')

    if (options?.checkAdmin) {
      const memberExists = await this.client.internals.cache.has(Keyspaces.GUILD_MEMBERS, this.guildId, id)

      if (memberExists) {
        const member = await this.client.internals.cache.get<string, GuildMember>(
          Keyspaces.GUILD_MEMBERS,
          this.guildId,
          'GuildMember',
          id
        )

        if (member?.guildOwner) return new ReadonlyPermissions(Permissions.ALL)
      } else {
        const guildExists = await this.client.guilds.cache.has(this.guildId)

        if (guildExists) {
          const guild = await this.client.guilds.cache.get(this.guildId)

          if (guild.ownerId === id) return new ReadonlyPermissions(Permissions.ALL)
        }
      }
    }

    const roleOverwrites: PermissionOverwrite[] = [], permissions = new Permissions(), rolesIds: string[] = []
    let memberOverwrite: PermissionOverwrite | undefined, everyoneOverwrite: PermissionOverwrite | undefined

    await this.client.internals.cache.forEach(
      Keyspaces.GUILD_MEMBER_ROLES,
      id,
      'Role',
      (role: Role) => (permissions.add(role.permissions) && rolesIds.push(id))
    )

    if (options?.checkAdmin && permissions.has(PermissionFlags.ADMINISTRATOR)) return new ReadonlyPermissions(Permissions.ALL)

    const predicate = async (overwrite: PermissionOverwrite) => {
      switch (true) {
        case overwrite.id === this.guildId:
          everyoneOverwrite = overwrite
          break
        case overwrite.channelId === id:
          memberOverwrite = overwrite
          break
        case rolesIds.includes(overwrite.id):
          roleOverwrites.push(overwrite)
          break
      }
    }

    await this.overwrites.cache.forEach(predicate)

    if (typeof everyoneOverwrite?.deny.bitfield === 'bigint') {
      permissions.remove(everyoneOverwrite!.deny.bitfield)
    }

    if (typeof everyoneOverwrite?.allow.bitfield === 'bigint') {
      permissions.add(everyoneOverwrite!.allow.bitfield)
    }

    roleOverwrites.forEach(overwrite => {
      if (typeof overwrite?.deny.bitfield === 'bigint') {
        permissions.remove(overwrite!.deny.bitfield)
      }

      if (typeof overwrite?.allow.bitfield === 'bigint') {
        permissions.add(overwrite!.allow.bitfield)
      }
    })

    if (typeof memberOverwrite?.deny.bitfield === 'bigint') {
      permissions.remove(memberOverwrite!.deny.bitfield)
    }

    if (typeof memberOverwrite?.allow.bitfield === 'bigint') {
      permissions.add(memberOverwrite!.allow.bitfield)
    }

    return new ReadonlyPermissions(permissions)
  }

  /**
   * Calculated member permissions for this channel, includes overwrites. If overwrites are not cached, this method is useless.
   * If the role is not in the cache,
   * the permissions of the role will be calculated without taking into account the original permissions of the role.
   * */
  async rolePermissions(role: RoleResolvable, options?: PermissionsCheckOptions): Promise<ReadonlyPermissions> {
    const id = resolveRoleId(role)

    if (!id) throw new DiscordooError('Channel#rolePermissions', 'Cannot check role permissions without role')

    const roleCache = await this.client.internals.cache.get<string, Role>(Keyspaces.GUILD_ROLES, this.guildId, 'Role', id)

    if (options?.checkAdmin) {
      if (roleCache?.permissions.has(PermissionFlags.ADMINISTRATOR)) return new ReadonlyPermissions(Permissions.ALL)
    }

    const permissions = new Permissions(roleCache?.permissions),
      everyoneOverwrite = await this.overwrites.cache.get(this.guildId),
      roleOverwrite = await this.overwrites.cache.get(id)

    if (typeof everyoneOverwrite?.deny.bitfield === 'bigint') {
      permissions.remove(everyoneOverwrite!.deny.bitfield)
    }

    if (typeof everyoneOverwrite?.allow.bitfield === 'bigint') {
      permissions.add(everyoneOverwrite!.allow.bitfield)
    }

    if (typeof roleOverwrite?.deny.bitfield === 'bigint') {
      permissions.remove(roleOverwrite!.deny.bitfield)
    }

    if (typeof roleOverwrite?.allow.bitfield === 'bigint') {
      permissions.add(roleOverwrite!.allow.bitfield)
    }

    return new ReadonlyPermissions(permissions)
  }

  /**
   * Members that can view this channel or joined to this channel.
   * It is recommended not to use. Performance: O(n log n).
   * */
  async members(): Promise<GuildMember[]> {
    const predicate = async (member: GuildMember) => {
      return (await this.memberPermissions(member.userId, { checkAdmin: true })).has(PermissionFlags.VIEW_CHANNEL)
    }

    return this.client.internals.cache.filter('members', this.id, 'GuildMember', predicate)
      .then(results => results.map(r => r[1])) // FIXME: low performance
  }

  toJson(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.toJson({
      ...properties,
      guildId: true,
      name: true,
      parentId: true,
      position: true,
    }, obj)
  }

}
