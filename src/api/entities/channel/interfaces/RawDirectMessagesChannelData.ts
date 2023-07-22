import { RawAbstractGuildTextChannelData, RawUserData } from '../../../../../src/api'
import { RawWritableChannelData } from '../../../../../src/api/entities/channel/interfaces/RawWritableChannelData'

export interface RawDirectMessagesChannelData extends RawAbstractGuildTextChannelData, RawWritableChannelData {
  recipients: RawUserData[]
}