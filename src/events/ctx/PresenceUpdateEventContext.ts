import { Presence, User } from '../../../src/api'
import { AbstractEventContext } from '../../../src/events'

export interface PresenceUpdateEventContext extends AbstractEventContext {
  updated: Presence
  stored?: Presence
  storedUser?: User
  updatedUser?: User
  userId: string
  guildId: string
}
