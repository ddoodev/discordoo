import { RawAbstractGuildChannelData } from '@src/api/entities/channel/interfaces/RawAbstractGuildChannelData'

export interface RawAbstractGuildTextChannelData extends RawAbstractGuildChannelData {
  topic?: string
  nsfw?: boolean
  last_message_id?: string
  last_pin_timestamp?: string
  default_auto_archive_duration?: number
}
