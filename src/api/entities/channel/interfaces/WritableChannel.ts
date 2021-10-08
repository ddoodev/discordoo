import { Message } from '@src/api'
import { MessageContent } from '@src/api/entities/message/interfaces/MessageContent'
import { SendOptions } from '@src/api/entities/message/interfaces/SendOptions'
import { ChannelMessagesManager } from '@src/api/managers/messages/ChannelMessagesManager'

export interface WritableChannel {
  messages: ChannelMessagesManager

  send(content: MessageContent, options?: SendOptions): Promise<Message | undefined>
}
