import { EntitiesCacheManager, Message } from '@src/api'
import { Client } from '@src/core'
import { MessagesManagerData } from '@src/api/managers/messages/MessagesManagerData'
import { AbstractChannel } from '@src/api/entities/channel/AbstractChannel'
import { MessageContent } from '@src/api/entities/message/interfaces/MessageContent'
import { SendOptions } from '@src/api/entities/message/interfaces/SendOptions'
import { EntitiesManager } from '@src/api/managers/EntitiesManager'

export class ChannelMessagesManager extends EntitiesManager {
  public cache: EntitiesCacheManager<Message>
  public channel?: AbstractChannel
  public channelId: string

  constructor(client: Client, data: MessagesManagerData) {
    super(client)

    this.channel = data.channel
    this.channelId = data.channelId

    this.cache = new EntitiesCacheManager<Message>(this.client, {
      keyspace: 'messages',
      storage: this.channelId,
      entity: 'Message',
      policy: 'messages'
    })
  }

  async create(content: MessageContent, options?: SendOptions) {
    return this.client.messages.create(this.channelId, content, options)
  }
}
