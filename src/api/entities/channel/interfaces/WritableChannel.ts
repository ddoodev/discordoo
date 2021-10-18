import { Message } from '@src/api'
import { MessageContent } from '@src/api/entities/message/interfaces/MessageContent'
import { MessageCreateOptions } from '@src/api/entities/message/interfaces/MessageCreateOptions'
import { ChannelMessagesManager } from '@src/api/managers/messages/ChannelMessagesManager'

export interface WritableChannel {
  messages: ChannelMessagesManager

  send(content: MessageContent, options?: MessageCreateOptions): Promise<Message | undefined>
}
