import { AbstractGuildData } from '@src/api/entities/guild/interfaces/AbstractGuildData'

export interface RawOAuth2GuildData extends AbstractGuildData {
  owner: boolean
  permissions: string
}