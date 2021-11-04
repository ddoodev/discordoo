import { MessageResolvable } from '@src/api'
import { ThreadTypes } from '@src/constants'

export interface ThreadChannelCreateData {
  name: string
  autoArchiveDuration?: number
  message?: MessageResolvable
  type?: ThreadTypes
  invitable?: boolean
}
