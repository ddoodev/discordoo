import { AbstractEventContext } from '../../../../src/events'
import { GuildMember } from '../../../../src/api'

export interface GuildMemberUpdateEventContext extends AbstractEventContext {
  guildId: string
  userId: string
  stored?: GuildMember
  updated: GuildMember
}