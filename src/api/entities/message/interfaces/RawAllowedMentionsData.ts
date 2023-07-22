import { AllowedMentionTypes } from '../../../../../src/constants'

export interface RawAllowedMentionsData {
  parse?: AllowedMentionTypes[]
  roles?: string[]
  users?: string[]
  replied_user?: boolean
}
