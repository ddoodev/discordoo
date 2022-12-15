import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { EntitiesCacheManager, User, UserResolvable } from '@src/api'
import { DiscordApplication } from '@src/core'
import { ReactionUsersManagerData } from '@src/api/managers/reactions/ReactionUsersManagerData'
import { Keyspaces } from '@src/constants'
import { Collection } from '@discordoo/collection'
import { FetchReactionUsersOptions } from '@src/api/managers/reactions/FetchReactionUsersOptions'

export class ReactionUsersManager extends EntitiesManager {
  public cache: EntitiesCacheManager<User>
  public emojiId: string
  public channelId: string
  public messageId: string

  constructor(app: DiscordApplication, data: ReactionUsersManagerData) {
    super(app)

    this.emojiId = data.emojiId
    this.channelId = data.channelId
    this.messageId = data.messageId

    this.cache = new EntitiesCacheManager<User>(this.app, {
      keyspace: Keyspaces.MessageReactionUsers,
      storage: this.emojiId,
      entity: 'User',
      policy: 'users'
    })
  }

  fetch(options?: FetchReactionUsersOptions): Promise<Collection<string, User> | undefined> {
    return this.app.reactions.fetchUsers(this.channelId, this.messageId, this.emojiId, options)
  }

  remove(user: UserResolvable | '@me'): Promise<boolean> {
    return this.app.reactions.removeUser(this.channelId, this.messageId, this.emojiId, user)
  }

  removeMe(): Promise<boolean> {
    return this.remove('@me')
  }

  removeAll(): Promise<boolean> {
    return this.app.reactions.delete(this.channelId, this.messageId, this.emojiId)
  }

}
