import { EntitiesCacheManager, Message } from '@src/api'
import { Client } from '@src/core'
import { MessagesManagerData } from '@src/api/managers/messages/MessagesManagerData'
import { MessageContent } from '@src/api/entities/message/interfaces/MessageContent'
import { MessageCreateOptions } from '@src/api/entities/message/interfaces/MessageCreateOptions'
import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { resolveChannelId } from '@src/utils/resolve'
import { DiscordooError } from '@src/utils'
import { Keyspaces } from '@src/constants'

export class ChannelMessagesManager extends EntitiesManager {
  public cache: EntitiesCacheManager<Message>
  public channelId: string

  constructor(client: Client, data: MessagesManagerData) {
    super(client)

    const id = resolveChannelId(data.channel)
    if (!id) throw new DiscordooError('ChannelMessagesManager', 'Cannot operate without channel id.')
    this.channelId = id

    this.cache = new EntitiesCacheManager<Message>(this.client, {
      keyspace: Keyspaces.MESSAGES,
      storage: this.channelId,
      entity: 'Message',
      policy: 'messages'
    })
  }

  create(content: MessageContent, options?: MessageCreateOptions): Promise<Message | undefined> {
    return this.client.messages.create(this.channelId, content, options)
  }
}
