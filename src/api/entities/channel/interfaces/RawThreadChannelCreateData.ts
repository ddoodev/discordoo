import { ThreadTypes } from '@src/constants'

export interface RawThreadChannelCreateData {
  name: string
  auto_archive_duration?: number
  type?: ThreadTypes
  invitable?: boolean
}
