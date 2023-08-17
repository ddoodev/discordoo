import {
  EntitiesCacheManager,
  RawRoleCreateData,
  Role,
  RoleCreateData
} from '@src/api'
import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { RestEligibleDiscordApplication } from '@src/core'
import { DiscordooError, resolveGuildId } from '@src/utils'
import { GuildRolesManagerData } from '@src/api/managers/roles/GuildRolesManagerData'

export class GuildRolesManager extends EntitiesManager {
  public cache: EntitiesCacheManager<Role>
  public guildId: string

  constructor(app: RestEligibleDiscordApplication, data: GuildRolesManagerData) {
    super(app)

    const id = resolveGuildId(data.guild)
    if (!id) throw new DiscordooError('GuildRolesManager', 'Cannot operate without guild id provided.')
    this.guildId = id

    this.cache = new EntitiesCacheManager<Role>(this.app, {
      keyspace: 'roles',
      storage: this.guildId,
      entity: 'Role',
      policy: 'roles'
    })
  }

  async fetch(id: string): Promise<Role | undefined> {
    return await this.app.roles.fetchOne(this.guildId, id)
  }

  async create(data: RoleCreateData | RawRoleCreateData, reason?: string): Promise<Role | undefined> {
    const role = await this.app.roles.create(this.guildId, data, reason)
    if (role) await this.cache.set(role.id, role)
    return role
  }

  async edit(id: string, data: RoleCreateData | RawRoleCreateData): Promise<Role | undefined> {
    const updated = await this.app.roles.edit(this.guildId, id, data)
    if (updated) await this.cache.set(updated.id, updated)
    return updated
  }

  async delete(id: string, reason?: string): Promise<boolean> {
    const result = await this.app.roles.delete(this.guildId, id, reason)
    if (result) await this.cache.delete(id)
    return result
  }
}