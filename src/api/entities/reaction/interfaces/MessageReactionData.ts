import { ChannelResolvable, EmojiResolvable, MessageResolvable } from '@src/api'

export interface MessageReactionData {
  me: boolean
  count: number
  emoji: EmojiResolvable
  message: MessageResolvable
  channel: ChannelResolvable
}
