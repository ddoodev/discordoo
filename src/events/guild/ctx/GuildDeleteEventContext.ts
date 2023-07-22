import { Guild } from '../../../../src/api'
import { AbstractEventContext } from '../../../../src/events'

export interface GuildDeleteEventContext extends AbstractEventContext {
  guild?: Guild
  guildId: string
  // whether the guild was available and now is unavailable
  toUnavailable: boolean
}