import { Message } from '@src/api'
import { MessageContent } from '@src/api/entities/message/interfaces/MessageContent'
import { MessageCreateOptions } from '@src/api/entities/message/interfaces/MessageCreateOptions'
import { ChannelMessagesManager } from '@src/api/managers/messages/ChannelMessagesManager'
import { DirectMessagesChannelMessagesManager } from '@src/api/managers/messages/DirectMessagesChannelMessagesManager'

export interface WritableChannel {
  messages: ChannelMessagesManager | DirectMessagesChannelMessagesManager

  send(content: MessageContent, options?: MessageCreateOptions): Promise<Message | undefined>

  lastMessageId?: string
  lastPinTimestamp?: number
  set lastMsgId(id: string)
  get lastPinDate(): Date | undefined
}
