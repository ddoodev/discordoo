import { AbstractChannelData } from '@src/api/entities/channel/interfaces/AbstractChannelData'
import { RawThreadMetadata } from '@src/api/entities/channel/interfaces/RawThreadMetadata'
import { RawThreadMemberData } from '@src/api/entities/member/interfaces/RawThreadMemberData'

export interface RawAbstractThreadChannelData extends AbstractChannelData {
  guild_id: string
  parent_id?: string
  owner_id?: string
  last_message_id?: string
  last_pin_timestamp?: string
  rate_limit_per_user?: number
  message_count?: number
  member_count?: number
  member?: RawThreadMemberData
  thread_metadata?: RawThreadMetadata
}
