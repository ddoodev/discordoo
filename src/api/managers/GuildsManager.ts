import { EntitiesCacheManager } from '@src/api/managers'
import { Client } from '@src/core'
import { Keyspaces } from '@src/constants'
import { EntitiesManager } from '@src/api/managers/EntitiesManager'

export class GuildsManager extends EntitiesManager { // TODO
  public cache: EntitiesCacheManager<any>

  constructor(client: Client) {
    super(client)

    this.cache = new EntitiesCacheManager<any>(this.client, {
      keyspace: Keyspaces.GUILDS,
      storage: 'global',
      entity: 'Message',
      policy: 'guilds'
    })
  }
}
