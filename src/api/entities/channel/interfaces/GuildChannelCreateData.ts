import { ChannelTypes } from '@src/constants'
import { PermissionOverwriteResolvable } from '@src/api/entities/overwrite/interfaces/PermissionOverwriteResolvable'

export interface GuildChannelCreateData {
  name: string
  type?: ChannelTypes
  position?: number
  topic?: string
  nsfw?: boolean
  rateLimitPerUser?: number
  bitrate?: number
  userLimit?: number
  permissionOverwrites?: PermissionOverwriteResolvable[]
  parentId?: string
  rtcRegion?: string
}
