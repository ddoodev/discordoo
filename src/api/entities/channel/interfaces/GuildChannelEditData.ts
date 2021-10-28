import { ChannelTypes, VideoQualityModes } from '@src/constants'
import { PermissionsOverwriteResolvable } from '@src/api/entities/overwrites/interfaces/PermissionsOverwriteResolvable'

export interface GuildChannelEditData {
  name?: string
  type?: ChannelTypes.GUILD_NEWS | ChannelTypes.GUILD_TEXT
  position?: number | null
  topic?: string | null
  nsfw?: boolean | null
  rateLimitPerUser?: number | null
  bitrate?: number | null
  userLimit?: number | null
  permissionOverwrites?: PermissionsOverwriteResolvable[] | null
  parentId?: string | null
  rtcRegion?: string | null
  videoQualityMode?: VideoQualityModes | null
}
