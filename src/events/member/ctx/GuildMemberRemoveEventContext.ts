import { GuildMember } from '@src/api'
import { AbstractEventContext } from '@src/events'

export interface GuildMemberRemoveEventContext extends AbstractEventContext {
  guildId: string
  userId: string
  member?: GuildMember
}