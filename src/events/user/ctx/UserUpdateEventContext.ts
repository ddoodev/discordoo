import { AbstractEventContext } from '@src/events'
import { ClientUser } from '@src/api'

export interface UserUpdateEventContext extends AbstractEventContext {
  userId: string
  stored: ClientUser
  updated: ClientUser
}