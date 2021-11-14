import { RawUserData } from '@src/api'
import { UnavailableGuildData } from '@src/api/entities/guild/interfaces/UnavailableGuildData'

export interface RawShardConnectedEventData {
  v: number
  user: RawUserData
  guilds: UnavailableGuildData[]
  session_id: string
  shard?: [ number, number ]
  application: {
    id: string
    flags: number
  }
}