import { EntitiesCacheManager, Message, MessageEditOptions, MessageResolvable } from '../../../../src/api'
import { DiscordRestApplication } from '../../../../src/core'
import { ChannelResolvable } from '../../../../src/api/entities/channel/interfaces/ChannelResolvable'
import { MessageContent } from '../../../../src/api/entities/message/interfaces/MessageContent'
import { MessageCreateOptions } from '../../../../src/api/entities/message/interfaces/MessageCreateOptions'
import {
  resolveChannelId,
  resolveMessageId,
} from '../../../../src/utils/resolve'
import { Keyspaces } from '../../../../src/constants'
import { createMessagePayload, DiscordooError, idToTimestamp } from '../../../../src/utils'
import { filterAndMap } from '../../../../src/utils/filterAndMap'
import { EntitiesManager } from '../../../../src/api/managers/EntitiesManager'
import { makeCachePointer } from '../../../../src/utils/cachePointer'
import { DeleteManyMessagesOptions } from '../../../../src/api/managers/messages/DeleteManyMessagesOptions'
import { FetchOneMessageOptions } from '../../../../src/api/managers/messages/FetchOneMessageOptions'
import { FetchManyMessagesQuery } from '../../../../src/api/managers/messages/FetchManyMessagesQuery'
import { is } from 'typescript-is'
import { EntitiesUtil } from '../../../../src/api/entities/EntitiesUtil'

export class ApplicationMessagesManager extends EntitiesManager {
  public cache: EntitiesCacheManager<Message>

  constructor(app: DiscordRestApplication) {
    super(app)

    this.cache = new EntitiesCacheManager<Message>(this.app, {
      keyspace: Keyspaces.Messages,
      storage: 'global',
      entity: 'Message',
      policy: 'messages'
    })
  }

  async pin(channel: ChannelResolvable, message: MessageResolvable, reason?: string): Promise<boolean> {
    const channelId = resolveChannelId(channel),
      messageId = resolveMessageId(message)

    if (!channelId) throw new DiscordooError('ApplicationMessagesManager#pin', 'Cannot pin message without channel id.')
    if (!messageId) throw new DiscordooError('ApplicationMessagesManager#pin', 'Cannot pin message without message id.')

    const response = await this.app.internals.actions.pinMessage(channelId, messageId, reason)

    return response.success
  }

  async unpin(channel: ChannelResolvable, message: MessageResolvable, reason?: string): Promise<boolean> {
    const channelId = resolveChannelId(channel),
      messageId = resolveMessageId(message)

    if (!channelId) throw new DiscordooError('ApplicationMessagesManager#unpin', 'Cannot unpin message without channel id.')
    if (!messageId) throw new DiscordooError('ApplicationMessagesManager#unpin', 'Cannot unpin message without message id.')

    const response = await this.app.internals.actions.unpinMessage(channelId, messageId, reason)

    return response.success
  }

  async fetchPinned(channel: ChannelResolvable): Promise<Message[] | undefined> {
    const channelId = resolveChannelId(channel)

    if (!channelId) {
      throw new DiscordooError('ApplicationMessagesManager#fetchPinned', 'Cannot fetch pinned messages without channel id.')
    }

    const response = await this.app.internals.actions.getPinnedMessages(channelId)
    const Message = EntitiesUtil.get('Message')

    if (response.success) {
      const result: Message[] = []

      await this.app.internals.cache.clear(Keyspaces.PinnedMessages, channelId)

      for await (const messageData of response.result) {
        const message = await new Message(this.app).init(messageData)
        await this.cache.set(message.id, message, { storage: channelId })
        await this.app.internals.cache.set(
          Keyspaces.PinnedMessages,
          channelId,
          'Message',
          'messages',
          message.id,
          makeCachePointer(Keyspaces.Messages, channelId, message.id)
        )
        result.push(message)
      }

      return result
    }

    return undefined
  }

  async fetchOne<R = Message>(
    channel: ChannelResolvable, message: MessageResolvable, options?: FetchOneMessageOptions
  ): Promise<R | undefined> {
    const channelId = resolveChannelId(channel),
      messageId = resolveMessageId(message)

    if (!channelId) throw new DiscordooError('ApplicationMessagesManager#fetchOne', 'Cannot fetch message without channel id.')
    if (!messageId) throw new DiscordooError('ApplicationMessagesManager#fetchOne', 'Cannot fetch message without message id.')

    const response = await this.app.internals.actions.getMessage(channelId, messageId)
    const Message = EntitiesUtil.get('Message')

    if (response.success) {
      if (options?.patchEntity) {
        return await options.patchEntity.init(response.result) as any
      } else {
        const msg = await new Message(this.app).init(response.result)
        await this.cache.set(msg.id, msg, { storage: channelId })
        return msg as any
      }
    }

    return undefined
  }

  async fetchMany(channel: ChannelResolvable, query: FetchManyMessagesQuery): Promise<Message[] | undefined> {
    const channelId = resolveChannelId(channel)

    if (!channelId) throw new DiscordooError('ApplicationMessagesManager#fetchMany', 'Cannot fetch messages without channel id.')

    if (!is<FetchManyMessagesQuery>(query)) {
      throw new DiscordooError('ApplicationMessagesManager#fetchMany', 'Incorrect fetch query provided:', query)
    }

    const response = await this.app.internals.actions.getMessages(channelId, query)
    const Message = EntitiesUtil.get('Message')

    if (response.success) {
      const result: Message[] = []

      for await (const messageData of response.result) {
        const message = await new Message(this.app).init(messageData)
        await this.cache.set(message.id, message, { storage: channelId })
        result.push(message)
      }

      return result
    }

    return undefined
  }

  fetch(
    channel: ChannelResolvable, message: MessageResolvable | FetchManyMessagesQuery, options?: FetchOneMessageOptions
  ): Promise<Message | Message[] | undefined> {
    return is<FetchManyMessagesQuery>(message) ? this.fetchMany(channel, message) : this.fetchOne(channel, message, options)
  }

  async create(channel: ChannelResolvable, content: MessageContent = '', options: MessageCreateOptions = {}): Promise<Message | undefined> {
    const channelId = resolveChannelId(channel)

    if (!channelId) throw new DiscordooError('ApplicationMessagesManager#create', 'Cannot create message without channel id.')

    const payload = await createMessagePayload(content, options)

    const response = await this.app.internals.actions.createMessage(channelId, payload)
    const Message = EntitiesUtil.get('Message')

    if (response.success) {
      return await new Message(this.app).init(response.result)
    }

    return undefined
  }

  async deleteOne(channel: ChannelResolvable, message: MessageResolvable, reason?: string): Promise<boolean> {
    const channelId = resolveChannelId(channel),
      messageId = resolveMessageId(message)

    if (!channelId) throw new DiscordooError('ApplicationMessagesManager#deleteOne', 'Cannot delete message without channel id.')
    if (!messageId) throw new DiscordooError('ApplicationMessagesManager#deleteOne', 'Cannot delete message without message id.')

    const response = await this.app.internals.actions.deleteMessage(channelId, messageId, reason)

    return response.success
  }

  async deleteMany(
    channel: ChannelResolvable, messages: MessageResolvable[] | number, options?: DeleteManyMessagesOptions
  ): Promise<string[] | undefined> {
    const channelId = resolveChannelId(channel)

    if (!channelId) throw new DiscordooError('ApplicationMessagesManager#deleteMany', 'Cannot delete messages without channel id.')

    let ids: string[] = []

    if (Array.isArray(messages)) {
      const twoWeeksAgo = Date.now() - 1209600000

      const filter = (message: MessageResolvable, filtered: string[]) => {
        const id = resolveMessageId(message)

        if (!id) return false
        if (filtered.includes(id)) return false

        return options?.filterOld ? idToTimestamp(id) >= twoWeeksAgo : true
      }

      ids = filterAndMap<MessageResolvable, string>(messages, filter, (m) => resolveMessageId(m))

      if (ids.length === 0) return ids

      if (ids.length === 1) {
        const result = await this.deleteOne(channel, ids[0], options?.reason)
        return result ? ids : undefined
      }

      const response = await this.app.internals.actions.deleteMessagesBulk(channelId, ids, options?.reason)
      if (response.success) return ids
    } else if (!isNaN(messages)) {
      const m = await this.fetchMany(channelId, { limit: messages })
      if (m) return this.deleteMany(channelId, m, options)
    }

    return undefined
  }

  async delete(
    channel: ChannelResolvable, messages: MessageResolvable | MessageResolvable[] | number, options?: DeleteManyMessagesOptions | string
  ): Promise<boolean | string[] | undefined> {
    if (Array.isArray(messages) || typeof messages === 'number') {
      return this.deleteMany(channel, messages, options as DeleteManyMessagesOptions)
    } else {
      return this.deleteOne(channel, messages, options as string)
    }
  }

  async edit(
    channel: ChannelResolvable, message: MessageResolvable, content: MessageContent = '', options: MessageEditOptions = {}
  ): Promise<Message | undefined> {
    const channelId = resolveChannelId(channel),
      messageId = resolveMessageId(message)

    if (!channelId) throw new DiscordooError('ApplicationMessagesManager#editOne', 'Cannot edit message without channel id.')
    if (!messageId) throw new DiscordooError('ApplicationMessagesManager#editOne', 'Cannot edit message without message id.')

    const payload = await createMessagePayload(content, options)

    const response = await this.app.internals.actions.editMessage(channelId, messageId, payload)
    const Message = EntitiesUtil.get('Message')

    if (response.success) {
      return await new Message(this.app).init(response.result)
    }

    return undefined
  }

}
