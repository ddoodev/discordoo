import { AbstractChannelData } from '@src/api/entities/channel/interfaces/AbstractChannelData'
import { ThreadMemberData } from '@src/api/entities/member/interfaces/ThreadMemberData'
import { ThreadMetadata } from '@src/api/entities/channel/interfaces/ThreadMetadata'
import { WritableChannelData } from '@src/api/entities/channel/interfaces/WritableChannelData'

export interface AbstractThreadChannelData extends AbstractChannelData, WritableChannelData {
  name: string
  guildId: string
  parentId?: string
  ownerId?: string
  rateLimitPerUser?: number
  messageCount?: number
  memberCount?: number
  member?: ThreadMemberData
  metadata?: ThreadMetadata
}
