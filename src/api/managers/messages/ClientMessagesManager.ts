import { EntitiesCacheManager, Message, MessageEmbedConstructor, MessageResolvable } from '@src/api'
import { Client } from '@src/core'
import { ChannelResolvable } from '@src/api/entities/channel/interfaces/ChannelResolvable'
import { MessageContent } from '@src/api/entities/message/interfaces/MessageContent'
import { MessageCreateOptions } from '@src/api/entities/message/interfaces/MessageCreateOptions'
import {
  resolveChannelId,
  resolveEmbedToRaw,
  resolveFile,
  resolveFiles,
  resolveMessageId, resolveMessageReferenceToRaw,
  resolveStickerId
} from '@src/utils/resolve'
import { MessageCreateData } from '@src/api/entities/message/interfaces/MessageCreateData'
import { StickerResolvable } from '@src/api/entities/sticker'
import { Keyspaces, MessageEmbedTypes, StickerFormatTypes } from '@src/constants'
import { createMessagePayload, DiscordooError, idToTimestamp } from '@src/utils'
import { DataResolver } from '@src/utils/DataResolver'
import { inspect } from 'util'
import { filterAndMap } from '@src/utils/filterAndMap'
import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { makeCachePointer } from '@src/utils/cachePointer'
import { DeleteManyMessagesOptions } from '@src/api/managers/messages/DeleteManyMessagesOptions'
import { FetchOneMessageOptions } from '@src/api/managers/messages/FetchOneMessageOptions'
import { FetchManyMessagesQuery } from '@src/api/managers/messages/FetchManyMessagesQuery'
import { is } from 'typescript-is'
import { EntitiesUtil } from '@src/api/entities/EntitiesUtil'

export class ClientMessagesManager extends EntitiesManager {
  public cache: EntitiesCacheManager<Message>

  constructor(client: Client) {
    super(client)

    this.cache = new EntitiesCacheManager<Message>(this.client, {
      keyspace: Keyspaces.Messages,
      storage: 'global',
      entity: 'Message',
      policy: 'messages'
    })
  }

  async pin(channel: ChannelResolvable, message: MessageResolvable, reason?: string): Promise<boolean> {
    const channelId = resolveChannelId(channel),
      messageId = resolveMessageId(message)

    if (!channelId) throw new DiscordooError('ClientMessagesManager#pin', 'Cannot pin message without channel id.')
    if (!messageId) throw new DiscordooError('ClientMessagesManager#pin', 'Cannot pin message without message id.')

    const response = await this.client.internals.actions.pinMessage(channelId, messageId, reason)

    return response.success
  }

  async unpin(channel: ChannelResolvable, message: MessageResolvable, reason?: string): Promise<boolean> {
    const channelId = resolveChannelId(channel),
      messageId = resolveMessageId(message)

    if (!channelId) throw new DiscordooError('ClientMessagesManager#unpin', 'Cannot unpin message without channel id.')
    if (!messageId) throw new DiscordooError('ClientMessagesManager#unpin', 'Cannot unpin message without message id.')

    const response = await this.client.internals.actions.unpinMessage(channelId, messageId, reason)

    return response.success
  }

  async fetchPinned(channel: ChannelResolvable): Promise<Message[] | undefined> {
    const channelId = resolveChannelId(channel)

    if (!channelId) {
      throw new DiscordooError('ClientMessagesManager#fetchPinned', 'Cannot fetch pinned messages without channel id.')
    }

    const response = await this.client.internals.actions.getPinnedMessages(channelId)
    const Message = EntitiesUtil.get('Message')

    if (response.success) {
      const result: Message[] = []

      await this.client.internals.cache.clear(Keyspaces.PinnedMessages, channelId)

      for await (const messageData of response.result) {
        const message = await new Message(this.client).init(messageData)
        await this.cache.set(message.id, message, { storage: channelId })
        await this.client.internals.cache.set(
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

    if (!channelId) throw new DiscordooError('ClientMessagesManager#fetchOne', 'Cannot fetch message without channel id.')
    if (!messageId) throw new DiscordooError('ClientMessagesManager#fetchOne', 'Cannot fetch message without message id.')

    const response = await this.client.internals.actions.getMessage(channelId, messageId)
    const Message = EntitiesUtil.get('Message')

    if (response.success) {
      if (options?.patchEntity) {
        return await options.patchEntity.init(response.result) as any
      } else {
        const msg = await new Message(this.client).init(response.result)
        await this.cache.set(msg.id, msg, { storage: channelId })
        return msg as any
      }
    }

    return undefined
  }

  async fetchMany(channel: ChannelResolvable, query: FetchManyMessagesQuery): Promise<Message[] | undefined> {
    const channelId = resolveChannelId(channel)

    if (!channelId) throw new DiscordooError('ClientMessagesManager#fetchMany', 'Cannot fetch messages without channel id.')

    if (!is<FetchManyMessagesQuery>(query)) {
      throw new DiscordooError('ClientMessagesManager#fetchMany', 'Incorrect fetch query provided:', query)
    }

    const response = await this.client.internals.actions.getMessages(channelId, query)
    const Message = EntitiesUtil.get('Message')

    if (response.success) {
      const result: Message[] = []

      for await (const messageData of response.result) {
        const message = await new Message(this.client).init(messageData)
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

    if (!channelId) throw new DiscordooError('ClientMessagesManager#create', 'Cannot create message without channel id.')

    const payload = await createMessagePayload(content, options)

    const response = await this.client.internals.actions.createMessage(channelId, payload)
    const Message = EntitiesUtil.get('Message')

    if (response.success) {
      return await new Message(this.client).init(response.result)
    }

    return undefined
  }

  async deleteOne(channel: ChannelResolvable, message: MessageResolvable, reason?: string): Promise<boolean> {
    const channelId = resolveChannelId(channel),
      messageId = resolveMessageId(message)

    if (!channelId) throw new DiscordooError('ClientMessagesManager#deleteOne', 'Cannot delete message without channel id.')
    if (!messageId) throw new DiscordooError('ClientMessagesManager#deleteOne', 'Cannot delete message without message id.')

    const response = await this.client.internals.actions.deleteMessage(channelId, messageId, reason)

    return response.success
  }

  async deleteMany(
    channel: ChannelResolvable, messages: MessageResolvable[] | number, options?: DeleteManyMessagesOptions
  ): Promise<string[] | undefined> {
    const channelId = resolveChannelId(channel)

    if (!channelId) throw new DiscordooError('ClientMessagesManager#deleteMany', 'Cannot delete messages without channel id.')

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

      const response = await this.client.internals.actions.deleteMessagesBulk(channelId, ids, options?.reason)
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

}
