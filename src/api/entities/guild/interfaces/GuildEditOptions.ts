import { Guild } from '@src/api'


export interface GuildEditOptions {
  reason?: string
  patchEntity?: Guild
}