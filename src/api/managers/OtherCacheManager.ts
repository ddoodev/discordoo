import { EntitiesCacheManager } from '@src/api/managers/EntitiesCacheManager'
import { DiscordRestApplication } from '@src/core'
import { Keyspaces } from '@src/constants'

export class OtherCacheManager extends EntitiesCacheManager<any> {
  constructor(app: DiscordRestApplication) {
    super(app, {
      keyspace: Keyspaces.Other,
      storage: 'global',
      entity: 'any'
    })
  }
}
