import { ChannelTypes } from '@src/constants'

export interface ChannelMentionData {
  id: string
  guildId: string
  type: ChannelTypes
  name: string
}
