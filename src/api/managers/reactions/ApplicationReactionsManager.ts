import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { DiscordApplication } from '@src/core'
import { ChannelResolvable, EmojiResolvable, EntitiesCacheManager, MessageResolvable, User, UserResolvable } from '@src/api'
import { MessageReaction } from '@src/api/entities/reaction/MessageReaction'
import { Keyspaces } from '@src/constants'
import { DiscordooError, resolveChannelId, resolveEmojiId, resolveMessageId, resolveUserId } from '@src/utils'
import { FetchReactionUsersOptions } from '@src/api/managers/reactions/FetchReactionUsersOptions'
import { Collection } from '@discordoo/collection'
import { MessageReactionResolvable } from '@src/api/entities/reaction/interfaces/MessageReactionResolvable'
import { makeCachePointer } from '@src/utils/cachePointer'
import { EntitiesUtil } from '@src/api/entities/EntitiesUtil'

export class ApplicationReactionsManager extends EntitiesManager {
  public cache: EntitiesCacheManager<MessageReaction>

  constructor(app: DiscordApplication) {
    super(app)

    this.cache = new EntitiesCacheManager<MessageReaction>(this.app, {
      keyspace: Keyspaces.MessageReactions,
      storage: 'global',
      entity: 'MessageReaction',
      policy: 'reactions'
    })
  }

  async add(
    channel: ChannelResolvable, message: MessageResolvable, emoji: EmojiResolvable | MessageReactionResolvable
  ): Promise<boolean> {
    const channelId = resolveChannelId(channel),
      messageId = resolveMessageId(message),
      emojiId = resolveEmojiId(emoji)

    if (!channelId) {
      throw new DiscordooError(
        'ApplicationReactionsManager#add',
        'Cannot add reaction without channel id.'
      )
    }

    if (!messageId) {
      throw new DiscordooError(
        'ApplicationReactionsManager#add',
        'Cannot add reaction without message id.'
      )
    }

    if (!emojiId) {
      throw new DiscordooError(
        'ApplicationReactionsManager#add',
        'Cannot add reaction without emoji identifier.'
      )
    }

    const response = await this.app.internals.actions.addReaction(channelId, messageId, emojiId)

    return response.success
  }

  async fetchUsers(
    channel: ChannelResolvable,
    message: MessageResolvable,
    emoji: EmojiResolvable | MessageReactionResolvable,
    options?: FetchReactionUsersOptions
  ): Promise<Collection<string, User> | undefined> {
    const channelId = resolveChannelId(channel),
      messageId = resolveMessageId(message),
      emojiId = resolveEmojiId(emoji)

    if (!channelId) {
      throw new DiscordooError(
        'ApplicationReactionsManager#fetchUsers',
        'Cannot fetch reaction users without channel id.'
      )
    }

    if (!messageId) {
      throw new DiscordooError(
        'ApplicationReactionsManager#add',
        'Cannot fetch reaction users without message id.'
      )
    }

    if (!emojiId) {
      throw new DiscordooError(
        'ApplicationReactionsManager#add',
        'Cannot fetch reaction users without emoji identifier.'
      )
    }

    const response = await this.app.internals.actions.getReactionUsers(channelId, messageId, emojiId, options)
    const User = EntitiesUtil.get('User')

    if (response.success) {
      const result = new Collection()

      for await (const data of response.result) {
        const user = await new User(this.app).init(data)
        await this.app.users.cache.set(user.id, user)
        await this.app.internals.cache.set(
          Keyspaces.MessageReactionUsers,
          emojiId,
          'User',
          'users',
          user.id,
          makeCachePointer(Keyspaces.Users, 'global', user.id)
        )
        result.set(user.id, user)
      }

      return result
    }

    return undefined
  }

  async removeUser(
    channel: ChannelResolvable,
    message: MessageResolvable,
    emoji: EmojiResolvable | MessageReactionResolvable,
    user: UserResolvable | '@me'
  ): Promise<boolean> {
    const channelId = resolveChannelId(channel),
      messageId = resolveMessageId(message),
      emojiId = resolveEmojiId(emoji),
      userId = user === '@me' ? user : resolveUserId(user)

    if (!channelId) {
      throw new DiscordooError(
        'ApplicationReactionsManager#removeUser',
        'Cannot remove user from reaction without channel id.'
      )
    }

    if (!messageId) {
      throw new DiscordooError(
        'ApplicationReactionsManager#removeUser',
        'Cannot remove user from reaction without message id.'
      )
    }

    if (!emojiId) {
      throw new DiscordooError(
        'ApplicationReactionsManager#removeUser',
        'Cannot remove user from reaction without emoji identifier.'
      )
    }

    if (!userId) {
      throw new DiscordooError(
        'ApplicationReactionsManager#removeUser',
        'Cannot remove user from reaction without user id.'
      )
    }

    const response = await this.app.internals.actions.removeReactionUser(channelId, messageId, emojiId, userId)

    return response.success
  }

  removeClient(
    channel: ChannelResolvable, message: MessageResolvable, emoji: EmojiResolvable | MessageReactionResolvable
  ): Promise<boolean> {
    return this.removeUser(channel, message, emoji, '@me')
  }

  async delete(
    channel: ChannelResolvable, message: MessageResolvable, emoji: EmojiResolvable | MessageReactionResolvable
  ): Promise<boolean> {
    const channelId = resolveChannelId(channel),
      messageId = resolveMessageId(message),
      emojiId = resolveEmojiId(emoji)

    if (!channelId) {
      throw new DiscordooError(
        'ApplicationReactionsManager#remove',
        'Cannot remove all users from reaction without channel id.'
      )
    }

    if (!messageId) {
      throw new DiscordooError(
        'ApplicationReactionsManager#remove',
        'Cannot remove all users from reaction without message id.'
      )
    }

    if (!emojiId) {
      throw new DiscordooError(
        'ApplicationReactionsManager#remove',
        'Cannot remove all users from reaction without emoji identifier.'
      )
    }

    const response = await this.app.internals.actions.removeReactionUsers(channelId, messageId, emojiId)

    return response.success
  }

  async removeAll(channel: ChannelResolvable, message: MessageResolvable): Promise<boolean> {
    const channelId = resolveChannelId(channel),
      messageId = resolveMessageId(message)

    if (!channelId) {
      throw new DiscordooError(
        'ApplicationReactionsManager#removeAll',
        'Cannot remove all reactions without channel id.'
      )
    }

    if (!messageId) {
      throw new DiscordooError(
        'ApplicationReactionsManager#removeAll',
        'Cannot remove all reactions without message id.'
      )
    }

    const response = await this.app.internals.actions.removeReactions(channelId, messageId)

    return response.success
  }
}
