import { RawUserData } from '@src/api'
import { PresenceStatus } from '@src/api/entities/presence/interfaces/PresenceStatus'
import { RawPresenceActivityData } from '@src/api/entities/presence/interfaces/RawPresenceActivityData'
import { PresenceClientStatusData } from '@src/api/entities/presence/interfaces/PresenceClientStatusData'

export interface RawPresenceData {
  user: RawUserData
  guild_id: string
  status: PresenceStatus
  activities: RawPresenceActivityData[]
  client_status: PresenceClientStatusData
}
