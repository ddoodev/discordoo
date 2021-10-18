import { EntitiesCacheManager, Role } from '@src/api'
import { Client } from '@src/core'
import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { GuildMemberRolesManagerData } from '@src/api/managers/members/GuildMemberRolesManagerData'
import { resolveUserId } from '@src/utils/resolve'
import { DiscordooError } from '@src/utils'
import { Keyspaces } from '@src/constants'

export class GuildMemberRolesManager extends EntitiesManager {
  public cache: EntitiesCacheManager<Role>
  public userId: string

  constructor(client: Client, data: GuildMemberRolesManagerData) {
    super(client)

    const id = resolveUserId(data.user)
    if (!id) throw new DiscordooError('GuildMemberRolesManager', 'Cannot operate without user id.')
    this.userId = id

    this.cache = new EntitiesCacheManager<Role>(this.client, {
      keyspace: Keyspaces.GUILD_MEMBER_ROLES,
      storage: this.userId,
      entity: 'Role',
      policy: 'roles'
    })
  }


}
