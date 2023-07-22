import { ChannelResolvable } from '@src/api'

export interface MessagesManagerData {
  channel: ChannelResolvable
  lastMessageId?: string
  lastPinTimestamp?: number
}
