import { AbstractGuildData } from '@src/api/entities/guild/interfaces/AbstractGuildData'
import { PermissionsResolvable } from '@src/api'

export interface OAuth2GuildData extends AbstractGuildData {
  owner: boolean
  permissions: PermissionsResolvable
}