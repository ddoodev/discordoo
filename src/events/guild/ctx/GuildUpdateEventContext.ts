import { AbstractEventContext } from '@src/events'
import { Guild } from '@src/api'

export interface GuildUpdateEventContext extends AbstractEventContext {
  guildId: string
  stored?: Guild
  updated: Guild
}