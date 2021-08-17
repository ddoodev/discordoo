import { EntitiesManager } from '@src/entities/managers/EntitiesManager'
import { Client } from '@src/core'
import { EntitiesCacheManager } from '@src/entities/managers/EntitiesCacheManager'
import { Guild } from '@src/entities'

export class GuildsManager extends EntitiesManager {
  public cache: EntitiesCacheManager<Guild>

  constructor(client: Client) {
    super(client)

    this.cache = new EntitiesCacheManager<Guild>(this.client, 'Guild', 'guilds', 'global')
  }
}
