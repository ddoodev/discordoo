import { Guild } from '@src/api'
import { AbstractEventContext } from '@src/events'

export interface GuildCreateEventContext extends AbstractEventContext {
  guild: Guild
  guildId: string
  // whether the guild was unavailable and now is available
  fromUnavailable: boolean
}