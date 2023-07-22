import { AbstractEventContext } from '../../../../src/events'
import { Invite, User } from '../../../../src/api'

export interface InviteCreateEventContext extends AbstractEventContext {
  invite: Invite
  code: string
  guildId?: string
  channelId: string
  inviter?: User
  inviterId?: string
  targetUser?: User
  targetUserId?: string
}