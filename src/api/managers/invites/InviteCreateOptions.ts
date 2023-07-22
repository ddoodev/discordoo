import { InviteCreateData } from '@src/api'

export interface InviteCreateOptions extends InviteCreateData {
  reason?: string
}