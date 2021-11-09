import { AbstractChannelData } from '@src/api/entities/channel/interfaces/AbstractChannelData'
import { RawThreadMemberData } from '@src/api/entities/channel/interfaces/RawThreadMemberData'
import { RawThreadMetadata } from '@src/api/entities/channel/interfaces/RawThreadMetadata'
import { ThreadMemberData } from '@src/api/entities/channel/interfaces/ThreadMemberData'
import { ThreadMetadata } from '@src/api/entities/channel/interfaces/ThreadMetadata'

export interface AbstractThreadChannelData extends AbstractChannelData {
  guildId: string
  parentId?: string
  ownerId?: string
  lastMessageId?: string
  lastPinTimestamp?: string
  rateLimitPerUser?: number
  messageCount?: number
  memberCount?: number
  member?: ThreadMemberData
  threadMetadata?: ThreadMetadata
}
