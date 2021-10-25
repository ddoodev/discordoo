import { EntitiesCacheManager, Presence } from '@src/api'
import { Client } from '@src/core'
import { Keyspaces } from '@src/constants'
import { EntitiesManager } from '@src/api/managers/EntitiesManager'

export class ClientPresencesManager extends EntitiesManager {
  public cache: EntitiesCacheManager<Presence>

  constructor(client: Client) {
    super(client)

    this.cache = new EntitiesCacheManager<Presence>(this.client, {
      keyspace: Keyspaces.GUILD_PRESENCES,
      storage: 'global',
      entity: 'Presence',
      policy: 'presences'
    })
  }
}
