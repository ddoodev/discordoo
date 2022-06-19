import { AbstractEventContext } from '@src/events'
import { User } from '@src/api'

export interface UserUpdateEventContext extends AbstractEventContext {
  userId: string
  stored?: User
  updated: User // TODO: may be ClientUser
}