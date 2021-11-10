import { ChannelResolvable, GuildResolvable, MessageResolvable } from '@src/api'

export interface MessageReferenceData {
  guild?: GuildResolvable
  channel: ChannelResolvable
  message: MessageResolvable
}
