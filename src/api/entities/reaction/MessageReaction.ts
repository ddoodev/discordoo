import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { GuildEmoji, Json, Message, ReactionEmoji, ToJsonProperties } from '@src/api'
import { attach, DiscordooError, resolveChannelId, resolveEmojiId, resolveMessageId } from '@src/utils'
import { MessageReactionData } from '@src/api/entities/reaction/interfaces/MessageReactionData'
import { ToJsonOverrideSymbol } from '@src/constants'
import { CacheManagerGetOptions } from '@src/cache'
import { ReactionUsersManager } from '@src/api/managers/reactions/ReactionUsersManager'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'

export class MessageReaction extends AbstractEntity {
  public declare count: number
  public declare me: boolean
  public declare messageId: string
  public declare channelId: string
  public declare emojiId: string
  public declare users: ReactionUsersManager

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async init(data: MessageReactionData, options?: EntityInitOptions): Promise<this> {
    // options declared for the future
    attach(this, data, {
      props: [
        'count',
        'me'
      ]
    })

    if (data.message) {
      const id = resolveMessageId(data.message)

      if (!id && !this.messageId) {
        throw new DiscordooError('MessageReaction', 'Cannot operate without message id.')
      }

      if (id) this.messageId = id
    }

    if (data.emoji) {
      const id = resolveEmojiId(data.emoji)

      if (!id && !this.emojiId) {
        throw new DiscordooError('MessageReaction', 'Cannot operate without emoji identifier.')
      }

      if (id) this.emojiId = id
    }

    if (data.channel) {
      const id = resolveChannelId(data.channel)

      if (!id && !this.channelId) {
        throw new DiscordooError('MessageReaction', 'Cannot operate without channel id.')
      }

      if (id) this.channelId = id
    }

    if (!this.users) {
      this.users = new ReactionUsersManager(this.client, {
        emojiId: this.emojiId,
        channelId: this.channelId,
        messageId: this.messageId,
      })
    }

    return this
  }

  async delete(): Promise<this | undefined> {
    const result = await this.client.reactions.delete(this.channelId, this.messageId, this.emojiId)

    return result ? this : undefined
  }

  async emoji(options?: CacheManagerGetOptions): Promise<ReactionEmoji | GuildEmoji | undefined> {
    return this.client.emojis.cache.get(this.emojiId, { ...options, storage: this.messageId })
  }

  async message(options?: CacheManagerGetOptions): Promise<Message | undefined> {
    return this.client.messages.cache.get(this.messageId, { ...options, storage: this.channelId })
  }

  toJson(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.toJson({
      ...properties,
      count: true,
      me: true,
      emoji: {
        override: ToJsonOverrideSymbol,
        value: this.emojiId
      },
      message: {
        override: ToJsonOverrideSymbol,
        value: this.messageId
      },
      channel: {
        override: ToJsonOverrideSymbol,
        value: this.channelId
      },
    }, obj)
  }
}
