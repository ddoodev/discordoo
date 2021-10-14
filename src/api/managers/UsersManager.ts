import { EntitiesManager, EntitiesCacheManager } from '@src/api/managers'
import { Client } from '@src/core'
import { User } from '@src/api/entities/user'

export class UsersManager extends EntitiesManager {
  public cache: EntitiesCacheManager<User>

  constructor(client: Client) {
    super(client)

    this.cache = new EntitiesCacheManager<User>(this.client, {
      keyspace: 'users',
      storage: 'global',
      entity: 'User',
      policy: 'users'
    })
  }
}
