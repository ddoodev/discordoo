import { AppCommandEditData, RawAppCommandEditData, SlashCommandBuilder, GuildAppCommandEditData,
  RawGuildAppCommandEditData } from '@src/api'

export type AnyAppCommand = SlashCommandBuilder
| RawGuildAppCommandEditData
| RawAppCommandEditData
| GuildAppCommandEditData
| AppCommandEditData
