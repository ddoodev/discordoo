import { AbstractChannelData } from '@src/api/entities/channel/interfaces/AbstractChannelData'
import { ThreadMemberData } from '@src/api/entities/member/interfaces/ThreadMemberData'
import { ThreadMetadata } from '@src/api/entities/channel/interfaces/ThreadMetadata'

export interface AbstractThreadChannelData extends AbstractChannelData {
  guildId: string
  parentId?: string
  ownerId?: string
  lastMessageId?: string
  lastPinTimestamp?: number
  rateLimitPerUser?: number
  messageCount?: number
  memberCount?: number
  member?: ThreadMemberData
  metadata?: ThreadMetadata
}
