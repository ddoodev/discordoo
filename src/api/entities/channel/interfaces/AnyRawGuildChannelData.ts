import { RawAbstractGuildChannelData } from '@src/api/entities/channel/interfaces/RawAbstractGuildChannelData'
import { RawAbstractGuildTextChannelData } from '@src/api/entities/channel/interfaces/RawAbstractGuildTextChannelData'
import { RawGuildTextChannelData } from '@src/api/entities/channel/interfaces/RawGuildTextChannelData'
import { RawGuildStoreChannelData } from '@src/api/entities/channel/interfaces/RawGuildStoreChannelData'

export type AnyRawGuildChannelData = RawAbstractGuildChannelData
  | RawAbstractGuildTextChannelData | RawGuildTextChannelData | RawGuildStoreChannelData