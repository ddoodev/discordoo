import { AbstractEventContext } from '../../../../src/events'
import { ApplicationUser } from '../../../../src/api'

export interface UserUpdateEventContext extends AbstractEventContext {
  userId: string
  stored: ApplicationUser
  updated: ApplicationUser
}