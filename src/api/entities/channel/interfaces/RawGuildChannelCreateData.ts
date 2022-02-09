import { ChannelTypes } from '@src/constants'
import { PermissionOverwriteResolvable } from '@src/api/entities/overwrite/interfaces/PermissionOverwriteResolvable'

export interface RawGuildChannelCreateData {
  name: string
  type?: ChannelTypes
  position?: number
  topic?: string
  nsfw?: boolean
  rate_limit_per_user?: number
  bitrate?: number
  user_limit?: number
  permission_overwrites?: PermissionOverwriteResolvable[]
  parent_id?: string
  rtc_region?: string
}
