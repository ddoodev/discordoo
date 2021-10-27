import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { EntitiesCacheManager } from '@src/api'
import { PermissionsOverwrite } from '@src/api/entities/overwrites/PermissionsOverwrite'
import { Client } from '@src/core'
import { Keyspaces } from '@src/constants'

export class ClientPermissionOverwritesManager extends EntitiesManager {
  public cache: EntitiesCacheManager<PermissionsOverwrite>

  constructor(client: Client) {
    super(client)

    this.cache = new EntitiesCacheManager<PermissionsOverwrite>(this.client, {
      keyspace: Keyspaces.CHANNEL_PERMISSIONS_OVERWRITES,
      storage: 'global',
      entity: 'PermissionsOverwrite'
    })
  }

}
