import { RawAbstractGuildChannelData } from '@src/api/entities/channel/interfaces/RawAbstractGuildChannelData'

export interface RawGuildStoreChannelData extends RawAbstractGuildChannelData {
  nsfw: boolean
}
