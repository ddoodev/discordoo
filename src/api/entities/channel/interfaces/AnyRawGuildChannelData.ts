import { RawAbstractGuildChannelData } from '@src/api/entities/channel/interfaces/RawAbstractGuildChannelData'
import { RawAbstractGuildTextChannelData } from '@src/api/entities/channel/interfaces/RawAbstractGuildTextChannelData'
import { RawGuildTextChannelData } from '@src/api/entities/channel/interfaces/RawGuildTextChannelData'
import { RawGuildStoreChannelData } from '@src/api/entities/channel/interfaces/RawGuildStoreChannelData'
import { RawDirectMessagesChannelData } from '@src/api/entities/channel/interfaces/RawDirectMessagesChannelData'

export type AnyRawGuildChannelData = RawAbstractGuildChannelData
  | RawAbstractGuildTextChannelData | RawGuildTextChannelData | RawGuildStoreChannelData

export type AnyRawChannelData = AnyRawGuildChannelData | RawDirectMessagesChannelData