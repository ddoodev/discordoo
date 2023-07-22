import { UserData } from '../../../../../src/api/entities/user/interfaces/UserData'

export interface GuildIntegrationApplicationData {
  id: string
  name: string
  icon?: string
  description: string
  bot?: UserData
}