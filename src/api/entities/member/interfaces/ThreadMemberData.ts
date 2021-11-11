import { BitFieldResolvable } from '@src/api'

export interface ThreadMemberData {
  threadId: string
  userId: string
  joinTimestamp: number
  flags: BitFieldResolvable
  guildId: string
}
