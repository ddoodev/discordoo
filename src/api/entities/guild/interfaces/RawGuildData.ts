import { RawViewableGuildData } from '@src/api'
import { DiscordLocale } from '@src/constants/common/DiscordLocale'
import { GuildExplicitContentFilterLevels } from '@src/constants'

export interface RawGuildData extends RawViewableGuildData {
  preferred_locale: DiscordLocale
  rules_channel_id: string | null
  public_updates_channel_id: string | null
  system_channel_id: string | null
  owner_id: string
  members_count: number
  explicit_content_filter: GuildExplicitContentFilterLevels
}
