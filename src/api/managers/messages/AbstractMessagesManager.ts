import {
  EntitiesCacheManager,
  Message,
  MessageContent,
  MessageCreateOptions,
  MessagesManagerData
} from '@src/api'
import { ChannelPinnedMessagesManager } from '@src/api/managers/messages/ChannelPinnedMessagesManager'
import { Client } from '@src/core'
import { DiscordooError, resolveChannelId } from '@src/utils'
import { Keyspaces } from '@src/constants'
import { EntitiesManager } from '@src/api/managers/EntitiesManager'

export abstract class AbstractMessagesManager extends EntitiesManager {
  public cache: EntitiesCacheManager<Message>
  public pinned: ChannelPinnedMessagesManager
  public channelId: string
  public lastMessageId?: string

  constructor(client: Client, data: MessagesManagerData) {
    super(client)

    const id = resolveChannelId(data.channel)
    if (!id) throw new DiscordooError('ChannelMessagesManager', 'Cannot operate without channel id.')
    this.channelId = id

    this.lastMessageId = data.lastMessageId

    this.cache = new EntitiesCacheManager<Message>(this.client, {
      keyspace: Keyspaces.MESSAGES,
      storage: this.channelId,
      entity: 'Message',
      policy: 'messages'
    })

    this.pinned = new ChannelPinnedMessagesManager(this.client, {
      channel: this.channelId,
      lastPinTimestamp: data.lastPinTimestamp
    })
  }

  create(content: MessageContent, options?: MessageCreateOptions): Promise<Message | undefined> {
    return this.client.messages.create(this.channelId, content, options)
  }

  async last(): Promise<Message | undefined> {
    return this.lastMessageId ? this.cache.get(this.lastMessageId) : undefined
  }
}
