import { ColorResolvable, EntitiesCacheManager, GuildResolvable, Role, RoleResolvable } from '@src/api'
import { Client } from '@src/core'
import { Keyspaces } from '@src/constants'
import { RoleEditData } from '@src/api/entities/role/interfaces/RoleEditData'
import { RawRoleEditData } from '@src/api/entities/role/interfaces/RawRoleEditData'
import { RoleEditOptions } from '@src/api/managers/roles/RoleEditOptions'
import { resolveBigBitField, resolveColor, resolveGuildId, resolveRoleId } from '@src/utils/resolve'
import { DiscordooError, WebSocketUtils } from '@src/utils'
import { DataResolver } from '@src/utils/DataResolver'
import { RoleCreateData } from '@src/api/entities/role/interfaces/RoleCreateData'
import { RawRoleCreateData } from '@src/api/entities/role/interfaces/RawRoleCreateData'
import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { EntitiesUtil } from '@src/api/entities/EntitiesUtil'

export class ClientRolesManager extends EntitiesManager {
  public cache: EntitiesCacheManager<Role>

  constructor(client: Client) {
    super(client)

    this.cache = new EntitiesCacheManager<Role>(this.client, {
      keyspace: Keyspaces.GUILD_ROLES,
      storage: 'global',
      entity: 'Role',
      policy: 'roles'
    })
  }

  async fetch(guild: GuildResolvable): Promise<Role[] | undefined> {
    const guildId = resolveGuildId(guild)

    if (!guildId) throw new DiscordooError('ClientRolesManager#fetch', 'Cannot fetch roles without guild id.')

    const response = await this.client.internals.actions.getGuildRoles(guildId)
    const Role = EntitiesUtil.get('Role')

    if (response.success) {
      const results: Role[] = []

      for await (const roleData of response.result) {
        const role = await new Role(this.client).init(roleData)
        await this.cache.set(role.id, role, {
          storage: guildId
        })
        results.push(role)
      }

      return results
    }

    return undefined
  }

  async create(
    guild: GuildResolvable, data: RoleCreateData | RawRoleCreateData, reason?: string
  ): Promise<Role | undefined> {
    const guildId = resolveGuildId(guild)

    if (!guildId) throw new DiscordooError('ClientRolesManager#create', 'Cannot create role without guild id.')

    let payload: RawRoleCreateData = {}

    payload = await ClientRolesManager._createPayload(payload, data)

    const response = await this.client.internals.actions.createGuildRole(guildId, payload, reason)
    const Role = EntitiesUtil.get('Role')

    if (response.success) {
      return await new Role(this.client).init({ ...response.result, guild_id: guildId })
    }

    return undefined
  }

  async edit<R = Role>(
    guild: GuildResolvable, role: RoleResolvable, data: RoleEditData | RawRoleEditData, options: RoleEditOptions = {}
  ): Promise<R | undefined> {
    const roleId = resolveRoleId(role),
      guildId = resolveGuildId(guild)

    if (!roleId) throw new DiscordooError('ClientRolesManager#edit', 'Cannot edit role without id.')
    if (!guildId) throw new DiscordooError('ClientRolesManager#edit', 'Cannot edit role without guild id.')

    let payload: RawRoleEditData = {}

    payload = await ClientRolesManager._createPayload(payload, data)

    const response = await this.client.internals.actions.editGuildRole(guildId, roleId, payload, options.reason)
    const Role = EntitiesUtil.get('Role')

    if (response.success) {
      if (options.patchEntity) {
        return await options.patchEntity.init(response.result) as any
      } else {
        return await new Role(this.client).init(response.result) as any
      }
    }

    return undefined
  }

  async delete(guild: GuildResolvable, role: RoleResolvable, reason?: string): Promise<boolean> {
    const roleId = resolveRoleId(role),
      guildId = resolveGuildId(guild)

    if (!roleId) throw new DiscordooError('ClientRolesManager#delete', 'Cannot delete role without id.')
    if (!guildId) throw new DiscordooError('ClientRolesManager#delete', 'Cannot delete role without guild id.')

    const response = await this.client.internals.actions.deleteGuildRole(guildId, roleId, reason)
    return response.success
  }

  private static async _createPayload(payload: any, data: any): Promise<any> {
    if (data.name) {
      payload.name = data.name
    }

    if (WebSocketUtils.exists(data.permissions)) {
      payload.permissions = resolveBigBitField(data.permissions).toString()
    }

    if (WebSocketUtils.exists<ColorResolvable>(data.color)) {
      payload.color = resolveColor(data.color)
    }

    if (data.icon) {
      payload.icon = await DataResolver.resolveBase64(data.icon)
    }

    if (typeof data.hoist === 'boolean') {
      payload.hoist = data.hoist
    }

    if (typeof data.mentionable === 'boolean') {
      payload.mentionable = data.mentionable
    }

    if ('unicode_emoji' in data && data.unicode_emoji) {
      payload.unicode_emoji = encodeURIComponent(data.unicode_emoji)
    } else if ('unicodeEmoji' in data && data.unicodeEmoji) {
      payload.unicode_emoji = encodeURIComponent(data.unicodeEmoji)
    }

    return payload
  }
}
