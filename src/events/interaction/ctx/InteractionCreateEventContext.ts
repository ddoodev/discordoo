import { AbstractEventContext } from '@src/events'
import { GuildMember } from '@src/api'
import { MixinSlashCommandOptionBase } from '@src/api/entities/interaction/mixins/MixinSlashCommandOptionBase'
import { DiscordLocale, InteractionTypes } from '@src/constants'
import { DiscordooSnowflake } from '@src/utils'

// eslint-disable-next-line
export interface InteractionCreateEventContext extends AbstractEventContext {
  type: InteractionTypes
  member: GuildMember
  options: MixinSlashCommandOptionBase[]
  locale: DiscordLocale
  guildLocale: DiscordLocale
  id: DiscordooSnowflake
  guildId: DiscordooSnowflake
  channelId: DiscordooSnowflake

}