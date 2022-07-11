import { AbstractChannelData } from '@src/api/entities/channel/interfaces/AbstractChannelData'
import { RawThreadMetadata } from '@src/api/entities/channel/interfaces/RawThreadMetadata'
import { RawThreadMemberData } from '@src/api/entities/member/interfaces/RawThreadMemberData'
import { RawWritableChannelData } from '@src/api/entities/channel/interfaces/RawWritableChannelData'

export interface RawAbstractThreadChannelData extends AbstractChannelData, RawWritableChannelData {
  guild_id: string
  parent_id?: string
  owner_id?: string
  rate_limit_per_user?: number
  message_count?: number
  member_count?: number
  member?: RawThreadMemberData
  thread_metadata?: RawThreadMetadata
}
