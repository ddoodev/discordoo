import { AbstractGuildChannelData } from '@src/api/entities/channel/interfaces/AbstractGuildChannelData'
import { WritableChannelData } from '@src/api/entities/channel/interfaces/WritableChannelData'

export interface AbstractGuildTextChannelData extends AbstractGuildChannelData, WritableChannelData {
  topic?: string
  nsfw?: boolean
  defaultAutoArchiveDuration?: number
}
