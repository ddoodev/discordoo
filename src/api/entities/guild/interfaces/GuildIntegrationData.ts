import { GuildIntegrationExpireBehavior } from '../../../../../src/constants/entities/guild/GuildIntegrationExpireBehavior'
import { GuildIntegrationType } from '../../../../../src/constants/entities/guild/GuildIntegrationType'
import { UserData } from '../../../../../src/api/entities/user/interfaces/UserData'
import { GuildIntegrationAccountData } from '../../../../../src/api/entities/guild/interfaces/GuildIntegrationAccountData'
import { GuildIntegrationApplicationData } from '../../../../../src/api/entities/guild/interfaces/GuildIntergrationApplicationData'

export interface GuildIntegrationData {
  id: string
  name: string
  type: GuildIntegrationType
  enabled?: boolean
  syncing?: boolean
  roleId?: string
  enableEmoticons?: boolean
  expireBehavior?: GuildIntegrationExpireBehavior
  expireGracePeriod?: number
  user?: UserData
  account: GuildIntegrationAccountData
  syncedAt?: string
  subscriberCount?: number
  revoked?: boolean
  application?: GuildIntegrationApplicationData
}