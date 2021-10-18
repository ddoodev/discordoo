import { EntitiesCacheManager } from '@src/api/managers'
import { Client } from '@src/core'
import { User } from '@src/api/entities/user'
import { Keyspaces } from '@src/constants'
import { EntitiesManager } from '@src/api/managers/EntitiesManager'

export class UsersManager extends EntitiesManager {
  public cache: EntitiesCacheManager<User>

  constructor(client: Client) {
    super(client)

    this.cache = new EntitiesCacheManager<User>(this.client, {
      keyspace: Keyspaces.USERS,
      storage: 'global',
      entity: 'User',
      policy: 'users'
    })
  }
}
