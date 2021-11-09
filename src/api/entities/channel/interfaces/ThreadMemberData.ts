import { BitFieldResolvable } from '@src/api'

export interface ThreadMemberData {
  id?: string
  userId?: string
  joinTimestamp: string
  flags: BitFieldResolvable
}
