import { EntitiesManager } from '@src/api/entities/managers/EntitiesManager'
import { Client } from '@src/core'
import { EntitiesCacheManager } from '@src/api/entities/managers/EntitiesCacheManager'
import { Guild } from '@src/api/entities'

export class GuildsManager extends EntitiesManager {
  public cache: EntitiesCacheManager<Guild>

  constructor(client: Client) {
    super(client)

    this.cache = new EntitiesCacheManager<Guild>(this.client, {
      keyspace: 'guilds',
      storage: 'global',
      entity: 'Guild',
      policy: 'guilds'
    })
  }
}
