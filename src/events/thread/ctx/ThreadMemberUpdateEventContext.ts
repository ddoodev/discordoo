import { AbstractEventContext } from '@src/events'
import { ThreadMember } from '@src/api'

export interface ThreadMemberUpdateEventContext extends AbstractEventContext {
  stored?: ThreadMember
  updated: ThreadMember
  guildId: string
  threadId: string
}
