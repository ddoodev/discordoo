import {
  AppCommandCreateData, RawAppCommandCreateData, AppCommandBuilder, GuildAppCommandCreateData, RawGuildAppCommandCreateData
} from '../../../../../../src/api'

export type AnyAppCommandData = AppCommandBuilder
  | RawGuildAppCommandCreateData
  | RawAppCommandCreateData
  | GuildAppCommandCreateData
  | AppCommandCreateData
