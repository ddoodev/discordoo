import { ChannelTypes } from '@src/constants'

export interface RawChannelMentionData {
  id: string
  guild_id: string
  type: ChannelTypes
  name: string
}
