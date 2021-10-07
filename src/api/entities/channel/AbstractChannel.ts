import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { ChannelMessagesManager } from '@src/api/managers/messages/ChannelMessagesManager'
import { MessageContent } from '@src/api/entities/message/interfaces/MessageContent'
import { SendOptions } from '@src/api/entities/message/interfaces/SendOptions'

export abstract class AbstractChannel extends AbstractEntity {
  public abstract messages: ChannelMessagesManager
  public abstract id: string

  send(content: MessageContent, options: SendOptions = {}) {
    return this.client.messages.create(this.id, content, options)
  }
}
