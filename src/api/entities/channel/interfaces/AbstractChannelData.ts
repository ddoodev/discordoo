import { ChannelTypes } from '@src/constants'

export interface AbstractChannelData {
  id: string
  type: ChannelTypes
  deleted?: boolean
}
