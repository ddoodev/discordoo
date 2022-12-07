import { DiscordLocale } from '@src/constants'

export interface RawMixinNameDescriptionData {
  name: string
  name_localizations?: Record<DiscordLocale, string>
  description: string
  description_localizations?: Record<DiscordLocale, string>
}
