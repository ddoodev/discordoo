import { AppCommandEditData } from '@src/api/entities/interaction/interfaces/command/common/AppCommandEditData'
import { RawAppCommandEditData } from '@src/api/entities/interaction/interfaces/command/raw/RawAppCommandEditData'
import { GuildResolvable } from '@src/api'

export interface RawGuildAppCommandEditData extends RawAppCommandEditData {
  guild: string
}

export interface GuildAppCommandEditData extends AppCommandEditData {
  guild: GuildResolvable
}