import { BufferResolvable } from '@src/utils'
import { GuildChannelCreateData, RoleCreateData } from '@src/api'

export interface GuildCreateData {
  name: string
  region?: string
  icon?: BufferResolvable
  verificationLevel?: number
  defaultNotifications?: number
  explicitContentFilter?: number
  roles?: RoleCreateData[]
  channels?: GuildChannelCreateData[]
  afkChannelId?: string
  afkTimeout?: number
  systemChannelId?: string
}