import { Presence, User } from '@src/api'

export interface PresenceUpdateEventContext {
  updated: Presence
  stored?: Presence
  user: User
  userId: string
  guildId: string
}
