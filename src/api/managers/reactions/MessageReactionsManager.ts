import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { DiscordApplication } from '@src/core'
import { EmojiResolvable, EntitiesCacheManager } from '@src/api'
import { MessageReaction } from '@src/api/entities/reaction/MessageReaction'
import { MessageReactionsManagerData } from '@src/api/managers/reactions/MessageReactionsManagerData'
import { Keyspaces } from '@src/constants'
import { MessageReactionResolvable } from '@src/api/entities/reaction/interfaces/MessageReactionResolvable'

export class MessageReactionsManager extends EntitiesManager {
  public cache: EntitiesCacheManager<MessageReaction>
  public channelId: string
  public messageId: string

  constructor(app: DiscordApplication, data: MessageReactionsManagerData) {
    super(app)

    this.channelId = data.channelId
    this.messageId = data.messageId

    this.cache = new EntitiesCacheManager<MessageReaction>(this.app, {
      keyspace: Keyspaces.MessageReactions,
      storage: this.messageId,
      entity: 'MessageReaction',
      policy: 'reactions'
    })
  }

  add(reaction: EmojiResolvable | MessageReactionResolvable): Promise<boolean> {
    return this.app.reactions.add(this.channelId, this.messageId, reaction)
  }

  remove(reaction: EmojiResolvable | MessageReactionResolvable): Promise<boolean> {
    return this.app.reactions.delete(this.channelId, this.messageId, reaction)
  }

  removeAll(): Promise<boolean> {
    return this.app.reactions.removeAll(this.channelId, this.messageId)
  }

}
