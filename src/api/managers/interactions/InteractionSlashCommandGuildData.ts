import { AppCommandCreateData, AppCommandEditData, GuildResolvable, RawAppCommandCreateData, RawAppCommandEditData } from '@src/api'

export interface RawGuildAppCommandCreateData extends RawAppCommandCreateData {
  guild: string
}

export interface GuildAppCommandCreateData extends AppCommandCreateData {
  guild: GuildResolvable
}

export type RawGuildAppCommandEditData = Omit<RawAppCommandEditData, 'dm_permission'>
export type GuildAppCommandEditData = Omit<AppCommandEditData, 'dmPermission'>
