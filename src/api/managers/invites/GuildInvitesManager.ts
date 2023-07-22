import { EntitiesCacheManager, InviteGuild } from '../../../../src/api'
import { EntitiesManager } from '../../../../src/api/managers/EntitiesManager'
import { DiscordRestApplication } from '../../../../src/core'
import { Keyspaces } from '../../../../src/constants'

export class GuildInvitesManager extends EntitiesManager {
  cache: EntitiesCacheManager<InviteGuild>

  constructor(app: DiscordRestApplication) {
    super(app)

    this.cache = new EntitiesCacheManager<InviteGuild>(this.app, {
      keyspace: Keyspaces.InviteGuilds,
      storage: 'global',
      entity: 'InviteGuild',
      policy: 'inviteGuilds'
    })
  }
}
