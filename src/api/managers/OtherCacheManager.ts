import { EntitiesCacheManager } from '@src/api/managers/EntitiesCacheManager'
import { DiscordApplication } from '@src/core'
import { Keyspaces } from '@src/constants'

export class OtherCacheManager extends EntitiesCacheManager<any> {

  constructor(app: DiscordApplication) {
    super(app, {
      keyspace: Keyspaces.Other,
      storage: 'global',
      entity: 'any'
    })
  }

}
