import { ChannelTypes, VideoQualityModes } from '../../../../../src/constants'
import { PermissionOverwriteResolvable } from '../../../../../src/api/entities/overwrite/interfaces/PermissionOverwriteResolvable'

export interface GuildChannelEditData {
  name?: string
  type?: ChannelTypes.GuildNews | ChannelTypes.GuildText
  position?: number | null
  topic?: string | null
  nsfw?: boolean | null
  rateLimitPerUser?: number | null
  bitrate?: number | null
  userLimit?: number | null
  permissionOverwrites?: PermissionOverwriteResolvable[] | null
  parentId?: string | null
  rtcRegion?: string | null
  videoQualityMode?: VideoQualityModes | null
}
