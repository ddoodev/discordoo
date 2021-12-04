import { PresenceActivityTypes } from '@src/constants'
import { PresenceActivityTimestampsData } from '@src/api/entities/presence/interfaces/PresenceActivityTimestampsData'
import { ActivityEmojiData, BitFieldResolvable } from '@src/api'
import { PresenceActivityPartyData } from '@src/api/entities/presence/interfaces/PresenceActivityPartyData'
import { PresenceActivitySecretsData } from '@src/api/entities/presence/interfaces/PresenceActivitySecretsData'
import { PresenceActivityButtonData } from '@src/api/entities/presence/interfaces/PresenceActivityButtonData'
import { PresenceActivityAssetsData } from '@src/api/entities/presence/interfaces/PresenceActivityAssetsData'

export interface PresenceActivityData {
  name: string
  type: PresenceActivityTypes
  url?: string
  createdTimestamp: number
  timestamps?: PresenceActivityTimestampsData
  applicationId?: string
  details?: string
  state?: string
  emoji?: ActivityEmojiData
  party?: PresenceActivityPartyData
  assets?: PresenceActivityAssetsData
  secrets?: PresenceActivitySecretsData
  instance?: boolean
  flags?: BitFieldResolvable
  buttons?: PresenceActivityButtonData[]
}
