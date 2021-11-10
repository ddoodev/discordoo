import { EntitiesCacheManager } from '@src/api/managers/EntitiesCacheManager'
import { Client } from '@src/core'
import { Keyspaces } from '@src/constants'

export class OtherCacheManager extends EntitiesCacheManager<any> {

  constructor(client: Client) {
    super(client, {
      keyspace: Keyspaces.OTHER,
      storage: 'global',
      entity: 'any'
    })
  }

}
