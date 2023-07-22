import { RawAbstractGuildChannelData } from '@src/api/entities/channel/interfaces/RawAbstractGuildChannelData'
import { RawWritableChannelData } from '@src/api/entities/channel/interfaces/RawWritableChannelData'

export interface RawAbstractGuildTextChannelData extends RawAbstractGuildChannelData, RawWritableChannelData {
  topic?: string
  nsfw?: boolean
  default_auto_archive_duration?: number
}
