import { EntitiesCacheManager, Presence } from '@src/api'
import { DiscordApplication, DiscordRestApplication } from '@src/core'
import { Keyspaces } from '@src/constants'
import { EntitiesManager } from '@src/api/managers/EntitiesManager'

export class ApplicationPresencesManager extends EntitiesManager {
  public cache: EntitiesCacheManager<Presence>

  constructor(app: DiscordRestApplication) {
    super(app)

    this.cache = new EntitiesCacheManager<Presence>(this.app, {
      keyspace: Keyspaces.GuildPresences,
      storage: 'global',
      entity: 'Presence',
      policy: 'presences'
    })
  }
}
