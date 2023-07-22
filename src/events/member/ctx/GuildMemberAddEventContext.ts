import { AbstractEventContext } from '../../../../src/events'
import { GuildMember } from '../../../../src/api'

export interface GuildMemberAddEventContext extends AbstractEventContext {
  guildId: string
  userId: string
  member: GuildMember
}