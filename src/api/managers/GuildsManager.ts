import { EntitiesManager, EntitiesCacheManager } from '@src/api/managers'
import { Client } from '@src/core'

export class GuildsManager extends EntitiesManager { // TODO
  public cache: EntitiesCacheManager<any>

  constructor(client: Client) {
    super(client)

    this.cache = new EntitiesCacheManager<any>(this.client, {
      keyspace: 'guilds',
      storage: 'global',
      entity: 'Message',
      policy: 'guilds'
    })
  }
}
