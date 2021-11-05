import { AbstractGuildChannelData } from '@src/api/entities/channel/interfaces/AbstractGuildChannelData'

export interface AbstractGuildTextChannelData extends AbstractGuildChannelData {
  topic?: string
  nsfw?: boolean
  lastMessageId?: string
  lastPinTimestamp?: string
  defaultAutoArchiveDuration?: number
}
