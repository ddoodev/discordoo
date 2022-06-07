import { AbstractEmoji } from '@src/api/entities/emoji/AbstractEmoji'
import { ReactionEmojiData } from '@src/api/entities/emoji/interfaces/ReactionEmojiData'
import { Json, ToJsonProperties } from '@src/api'
import { MessageReaction } from '@src/api/entities/reaction/MessageReaction'
import { Keyspaces } from '@src/constants'
import { CacheManagerGetOptions } from '@src/cache'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'

export class ReactionEmoji extends AbstractEmoji {
  public declare reactionMessageId: string

  async init(data: ReactionEmojiData, options?: EntityInitOptions): Promise<this> {
    await super.init(data, options)

    if (data.reactionMessageId) this.reactionMessageId = data.reactionMessageId

    return this
  }

  async reaction(options?: CacheManagerGetOptions): Promise<MessageReaction | undefined> {
    return this.client.internals.cache.get(
      Keyspaces.MESSAGE_REACTIONS,
      this.identifier,
      'MessageReaction',
      this.reactionMessageId,
      options
    )
  }

  toJson(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.toJson({
      ...properties,
      reactionMessageId: true
    }, obj)
  }
}
