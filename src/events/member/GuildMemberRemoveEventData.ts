import { RawUserData } from '@src/api'

export interface GuildMemberRemoveEventData {
  guild_id: string
  user: RawUserData
}