import { PresenceStatus } from '@src/api/entities/presence/interfaces/PresenceStatus'
import { PresenceClientStatusData } from '@src/api/entities/presence/interfaces/PresenceClientStatusData'
import { PresenceActivityData } from '@src/api/entities/presence/interfaces/PresenceActivityData'

export interface PresenceData {
  userId: string
  guildId: string
  status: PresenceStatus
  activities: PresenceActivityData[]
  clientStatus: PresenceClientStatusData
}
