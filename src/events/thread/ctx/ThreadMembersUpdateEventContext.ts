import { AbstractEventContext } from '@src/events'
import { AnyThreadChannel, GuildMember, ThreadMember } from '@src/api'
import { Collection } from '@discordoo/collection'

export interface ThreadMembersUpdateEventContext extends AbstractEventContext {
  addedIds: string[]
  removedIds: string[]
  guildId: string
  threadId: string
  added: Collection<string, ThreadMember>
  addedGuildMembers: Collection<string, GuildMember>
  removed: Collection<string, ThreadMember>
  thread?: AnyThreadChannel
}