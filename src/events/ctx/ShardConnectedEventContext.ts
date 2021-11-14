import { UnavailableGuildData } from '@src/api/entities/guild/interfaces/UnavailableGuildData'

export interface ShardConnectedEventContext {
  id: number
  unavailable: UnavailableGuildData[]
}