import { RawGuildChannelCreateData, RawRoleCreateData } from '@src/api'

export interface RawGuildCreateData {
  name: string
  region?: string
  icon?: Buffer | ArrayBuffer
  verificationLevel?: number
  defaultNotifications?: number
  explicitContentFilter?: number
  roles?: RawRoleCreateData[]
  channels?: RawGuildChannelCreateData[]
  afkChannelId?: string
  afkTimeout?: number
  systemChannelId?: string
}