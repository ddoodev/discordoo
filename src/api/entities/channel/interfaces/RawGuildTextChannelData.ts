import { RawAbstractGuildTextChannelData } from '@src/api/entities/channel/interfaces/RawAbstractGuildTextChannelData'

export interface RawGuildTextChannelData extends RawAbstractGuildTextChannelData {
  rate_limit_per_user?: number
}
