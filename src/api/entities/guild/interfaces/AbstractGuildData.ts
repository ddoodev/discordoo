import { GuildFeatures } from '@src/constants'

export interface AbstractGuildData {
  id: string
  name: string
  icon?: string
  features: GuildFeatures[]
}