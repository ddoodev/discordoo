import { RoleResolvable, UserResolvable } from '@src/api'
import { AllowedMentionTypes } from '@src/constants'

export interface AllowedMentionsData {
  parse?: AllowedMentionTypes[]
  roles?: RoleResolvable[]
  users?: UserResolvable[]
  repliedUser?: boolean
}
