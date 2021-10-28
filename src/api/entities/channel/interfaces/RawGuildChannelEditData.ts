import { ChannelTypes, VideoQualityModes } from '@src/constants'
import { RawPermissionsOverwriteData } from '@src/api/entities/overwrites/interfaces/RawPermissionsOverwriteData'

export interface RawGuildChannelEditData {
  name?: string
  type?: ChannelTypes.GUILD_NEWS | ChannelTypes.GUILD_TEXT
  position?: number | null
  topic?: string | null
  nsfw?: boolean | null
  rate_limit_per_user?: number | null
  bitrate?: number | null
  user_limit?: number | null
  permission_overwrites?: RawPermissionsOverwriteData[] | null
  parent_id?: string | null
  rtc_region?: string | null
  video_quality_mode?: VideoQualityModes | null
}
