import { EntitiesCacheManager, InviteGuild } from '@src/api'
import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { Client } from '@src/core'
import { Keyspaces } from '@src/constants'

export class GuildInvitesManager extends EntitiesManager {
  cache: EntitiesCacheManager<InviteGuild>

  constructor(client: Client) {
    super(client)

    this.cache = new EntitiesCacheManager<InviteGuild>(this.client, {
      keyspace: Keyspaces.INVITE_GUILDS,
      storage: 'global',
      entity: 'InviteGuild',
      policy: 'inviteGuilds'
    })
  }
}
