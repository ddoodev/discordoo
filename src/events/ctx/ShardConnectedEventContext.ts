import { UnavailableGuildData } from '@src/api/entities/guild/interfaces/UnavailableGuildData'
import { RawUserData } from '@src/api'

export interface ShardConnectedEventContext {
  id: number
  unavailable: UnavailableGuildData[]
  user: RawUserData
}