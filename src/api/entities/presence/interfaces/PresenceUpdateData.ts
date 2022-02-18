import { PresenceStatus } from '@src/api'
import { PresenceActivityUpdateData } from '@src/api/entities/presence/interfaces/PresenceActivityUpdateData'

export interface PresenceUpdateData {
  /** the user's new status */
  status?: PresenceStatus
  /** the user's activities */
  activities?: PresenceActivityUpdateData[]
  /** whether or not the client is afk */
  afk?: boolean
  /** unix time (in milliseconds) of when the client went idle, or null if the client is not idle */
  since?: number | null
}