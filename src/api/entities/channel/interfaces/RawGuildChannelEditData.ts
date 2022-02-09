import { ChannelTypes, VideoQualityModes } from '@src/constants'
import { RawPermissionOverwriteData } from '@src/api/entities/overwrite/interfaces/RawPermissionOverwriteData'

export interface RawGuildChannelEditData {
  name?: string
  type?: ChannelTypes.GUILD_NEWS | ChannelTypes.GUILD_TEXT
  position?: number | null
  topic?: string | null
  nsfw?: boolean | null
  rate_limit_per_user?: number | null
  bitrate?: number | null
  user_limit?: number | null
  permission_overwrites?: RawPermissionOverwriteData[] | null
  parent_id?: string | null
  rtc_region?: string | null
  video_quality_mode?: VideoQualityModes | null
}
