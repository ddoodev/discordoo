import {
  AppCommandCreateData, RawAppCommandCreateData, SlashCommandBuilder, GuildAppCommandCreateData, RawGuildAppCommandCreateData
} from '@src/api'

export type AnyAppCommandData = SlashCommandBuilder
  | RawGuildAppCommandCreateData
  | RawAppCommandCreateData
  | GuildAppCommandCreateData
  | AppCommandCreateData
