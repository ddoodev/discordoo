import { EntitiesCacheManager } from '@src/api/managers'
import { Client } from '@src/core'
import { Keyspaces } from '@src/constants'
import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { Guild } from '@src/api'

export class GuildsManager extends EntitiesManager {
  public cache: EntitiesCacheManager<Guild>

  constructor(client: Client) {
    super(client)

    this.cache = new EntitiesCacheManager<Guild>(this.client, {
      keyspace: Keyspaces.GUILDS,
      storage: 'global',
      entity: 'Guild',
      policy: 'guilds'
    })
  }
}
