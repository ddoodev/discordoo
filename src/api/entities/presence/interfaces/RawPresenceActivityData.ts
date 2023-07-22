import { PresenceActivityTypes } from '@src/constants'
import { PresenceActivityTimestampsData } from '@src/api/entities/presence/interfaces/PresenceActivityTimestampsData'
import { ActivityEmojiData } from '@src/api/entities/emoji'
import { PresenceActivityPartyData } from '@src/api/entities/presence/interfaces/PresenceActivityPartyData'
import { RawPresenceActivityAssetsData } from '@src/api/entities/presence/interfaces/RawPresenceActivityAssetsData'
import { PresenceActivitySecretsData } from '@src/api/entities/presence/interfaces/PresenceActivitySecretsData'
import { PresenceActivityButtonData } from '@src/api/entities/presence/interfaces/PresenceActivityButtonData'

export interface RawPresenceActivityData {
  name: string
  type: PresenceActivityTypes
  url?: string
  created_at: number
  timestamps?: PresenceActivityTimestampsData
  application_id?: string
  details?: string
  state?: string
  emoji?: ActivityEmojiData
  party?: PresenceActivityPartyData
  assets?: RawPresenceActivityAssetsData
  secrets?: PresenceActivitySecretsData
  instance?: boolean
  flags?: number
  buttons?: PresenceActivityButtonData[]
}
