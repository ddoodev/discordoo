import { RawViewableGuildData } from '@src/api'
import { DiscordLocale } from '@src/constants/common/DiscordLocale'

export interface RawGuildData extends RawViewableGuildData {
  preferred_locale: DiscordLocale
  rules_channel_id: string | null
  public_updates_channel_id: string | null
  system_channel_id: string | null
}