import { PresenceStatus } from '@src/api/entities/presence/interfaces/PresenceStatus'

export interface PresenceClientStatusData {
  desktop?: PresenceStatus
  mobile?: PresenceStatus
  web?: PresenceStatus
}
