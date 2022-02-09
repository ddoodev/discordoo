import { AbstractChannelData } from '@src/api/entities/channel/interfaces/AbstractChannelData'
import { PermissionOverwriteResolvable } from '@src/api/entities/overwrite/interfaces/PermissionOverwriteResolvable'

export interface RawAbstractGuildChannelData extends AbstractChannelData {
  name: string
  position: number
  guild_id: string
  parent_id?: string
  permission_overwrites?: PermissionOverwriteResolvable[]
}
