import { AbstractChannelData } from '@src/api'
import { WritableChannelData } from '@src/api/entities/channel/interfaces/WritableChannelData'

export interface DirectMessagesChannelData extends AbstractChannelData, WritableChannelData {
  recipientId: string
}