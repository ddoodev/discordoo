import { RawAbstractThreadChannelData } from '@src/api/entities/channel/interfaces/RawAbstractThreadChannelData'
import { RawThreadMemberData } from '@src/api/entities/member/interfaces/RawThreadMemberData'

export interface RawThreadListSyncEventData {
  guild_id: string
  channel_ids?: string[]
  threads: RawAbstractThreadChannelData[]
  members: RawThreadMemberData[]
}