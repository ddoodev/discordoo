import { Invite } from '@src/api'
import { AbstractEventContext } from '@src/events'

export interface InviteDeleteEventContext extends AbstractEventContext {
  invite: Invite
  code: string
  guildId?: string
  channelId?: string
}
