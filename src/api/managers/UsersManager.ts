import { EntitiesCacheManager } from '@src/api/managers'
import { Client } from '@src/core'
import { User, UserResolvable } from '@src/api/entities/user'
import { Keyspaces } from '@src/constants'
import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { DiscordooError, resolveUserId } from '@src/utils'
import { DirectMessagesChannel, EntitiesUtil } from '@src/api'

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

  async fetch(user: UserResolvable): Promise<User | undefined> {
    const userId = resolveUserId(user)

    if (!userId) throw new DiscordooError('UsersManager#fetch', 'Cannot fetch user without user id.')

    const response = await this.client.internals.actions.getUser(userId)
    const User = EntitiesUtil.get('User')

    if (response.success) {
      const cached = await this.cache.get(userId)
      const user = cached ? await cached.init(response.result) : await new User(this.client).init(response.result)
      await this.cache.set(user.id, user)
      return user
    }

    return undefined
  }

}
