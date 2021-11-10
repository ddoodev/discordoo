import { EntitiesCacheManager, GuildMember, Role, RoleResolvable } from '@src/api'
import { Client } from '@src/core'
import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { GuildMemberRolesManagerData } from '@src/api/managers/members/GuildMemberRolesManagerData'
import { resolveGuildId, resolveRoleId, resolveUserId } from '@src/utils/resolve'
import { DiscordooError } from '@src/utils'
import { Keyspaces } from '@src/constants'
import { filterAndMap } from '@src/utils/filterAndMap'

export class GuildMemberRolesManager extends EntitiesManager {
  public cache: EntitiesCacheManager<Role>
  public userId: string
  public guildId: string

  constructor(client: Client, data: GuildMemberRolesManagerData) {
    super(client)

    const userId = resolveUserId(data.user)
    if (!userId) throw new DiscordooError('GuildMemberRolesManager', 'Cannot operate without user id.')
    this.userId = userId

    const guildId = resolveGuildId(data.guild)
    if (!guildId) throw new DiscordooError('GuildMemberRolesManager', 'Cannot operate without guild id.')
    this.guildId = guildId

    this.cache = new EntitiesCacheManager<Role>(this.client, {
      keyspace: Keyspaces.GUILD_MEMBER_ROLES,
      storage: this.userId,
      entity: 'Role',
      policy: 'roles'
    })
  }

  addOne(role: RoleResolvable, reason?: string): Promise<boolean> {
    return this.client.members.addRole(this.guildId, this.userId, role, reason)
  }

  async addMany(roles: RoleResolvable[], reason?: string): Promise<GuildMember | undefined> {
    const member = await this.client.members.fetchOne(this.guildId, this.userId)

    if (!member) return undefined

    return this.client.members.edit(
      this.guildId, this.userId, { roles: [ ...member.rolesList, ...roles ] }, { reason }
    )
  }

  add(roleOrRoles: RoleResolvable | RoleResolvable[], reason?: string): Promise<boolean | GuildMember | undefined> {
    return Array.isArray(roleOrRoles) ? this.addMany(roleOrRoles, reason) : this.addOne(roleOrRoles, reason)
  }

  removeOne(role: RoleResolvable, reason?: string): Promise<boolean> {
    return this.client.members.removeRole(this.guildId, this.userId, role, reason)
  }

  async removeMany(roles: RoleResolvable[], reason?: string): Promise<GuildMember | undefined> {
    const member = await this.client.members.fetchOne(this.guildId, this.userId)

    if (!member) return undefined

    // array of unique snowflakes
    const resolved = filterAndMap<RoleResolvable, string>(
      roles,
      (r, filtered) => { const id = resolveRoleId(r); return id !== undefined && !filtered.includes(id) },
      (r) => resolveRoleId(r)
    )

    return this.client.members.edit(
      this.guildId, this.userId, { roles: member.rolesList.filter(id => !resolved.includes(id)) }, { reason }
    )
  }

  remove(roleOrRoles: RoleResolvable | RoleResolvable[], reason?: string): Promise<boolean | GuildMember | undefined> {
    return Array.isArray(roleOrRoles) ? this.removeMany(roleOrRoles, reason) : this.removeOne(roleOrRoles, reason)
  }

}
