import { EntitiesCacheManager, Message, MessageResolvable } from '@src/api'
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
import { DiscordooError, idToTimestamp } from '@src/utils'
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
      keyspace: Keyspaces.MESSAGES,
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

      await this.client.internals.cache.clear(Keyspaces.PINNED_MESSAGES, channelId)

      for await (const messageData of response.result) {
        const message = await new Message(this.client).init(messageData)
        await this.cache.set(message.id, message, { storage: channelId })
        await this.client.internals.cache.set(
          Keyspaces.PINNED_MESSAGES,
          channelId,
          'Message',
          'messages',
          message.id,
          makeCachePointer(Keyspaces.MESSAGES, channelId, message.id)
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

    let contentResolved = false

    if (!content) {
      if (
        !options.file && !options.embed && !options.sticker && !options.content &&
        !options.files?.length && !options.embeds?.length && !options.stickers?.length
      ) {
        throw new DiscordooError(
          'MessagesManager#create',
          'Incorrect content:', inspect(content) + '.',
          'If content not specified, options must be provided: at least one of options.embeds/embed/files/file/stickers/sticker/content.')
      } else {
        contentResolved = true
      }
    }

    const data: any /* MessageContent */ = content

    const payload: MessageCreateData = {
      content: '',
      allowed_mentions: undefined,
      message_reference: undefined,
      tts: false,
      embeds: [],
      files: [],
      stickers: [],
      components: [],
    }

    const embedTypes = Object.values<any>(MessageEmbedTypes).filter(v => typeof v === 'string'),
      stickerFormatTypes = Object.values<any>(StickerFormatTypes).filter(v => typeof v === 'number')

    if (Array.isArray(data)) {
      const target: /* MessageEmbedResolvable | StickerResolvable | MessageAttachmentResolvable */ any = content[0]

      if (embedTypes.includes(target.type)) { // content = embeds
        payload.embeds.push(...data.map(resolveEmbedToRaw))

      } else if (stickerFormatTypes.includes(target.formatType ?? target.format_type)) { // content = stickers
        const stickers = filterAndMap<StickerResolvable, string>(
          data,
          (s) => resolveStickerId(s) !== undefined,
          (s) => resolveStickerId(s)
        )

        payload.stickers.push(...stickers)

      } else { // content = files or unexpected things
        try {
          payload.files.push(...await resolveFiles(data))
        } catch (e: any) {
          throw new DiscordooError(
            'MessagesManager#create',
            'Tried to resolve array of attachments as message content, but got', (e.name ?? 'Error'),
            'with message:', (e.message ?? 'unknown error') + '.',
            'Check if you are pass the message content array correctly. Do not mix content types in this array.',
            'Allowed types is MessageEmbedResolvable, StickerResolvable, MessageAttachmentResolvable.',
            'If you pass anything other than these types to the message content array, you will get this error.'
          )
        }
      }

      contentResolved = true
    }

    if (!contentResolved) {
      if (embedTypes.includes(data.type)) {
        payload.embeds.push(resolveEmbedToRaw(data))

      } else if (stickerFormatTypes.includes(data.formatType ?? data.format_type)) {
        const id = resolveStickerId(data)
        if (id) payload.stickers.push(id)

      } else if (typeof data === 'object' && DataResolver.isMessageAttachmentResolvable(data)) {
        payload.files.push(await resolveFile(data))

      } else {
        payload.content = content.toString()
      }
    }

    payload.tts = !!options.tts

    if (options.content) payload.content = options.content

    if (options.messageReference) {
      payload.message_reference = resolveMessageReferenceToRaw(options.messageReference)
    }

    // TODO: allowed mentions
    // TODO: components

    if (options.embed) payload.embeds.push(resolveEmbedToRaw(options.embed))
    if (options.embeds?.length) payload.embeds.push(...options.embeds.map(resolveEmbedToRaw))

    if (options.file) payload.files.push(await resolveFile(options.file))
    if (options.files?.length) payload.files.push(...await resolveFiles(options.files))

    if (options.sticker) {
      const id = resolveStickerId(data.stickers)
      if (id) payload.stickers.push(id)
    }
    if (options.stickers?.length) {
      const stickers = filterAndMap<StickerResolvable, string>(
        options.stickers,
        (s) => resolveStickerId(s) !== undefined,
        (s) => resolveStickerId(s)
      )

      payload.stickers.push(...stickers)
    }

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
