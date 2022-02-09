import { AbstractChannelData } from '@src/api/entities/channel/interfaces/AbstractChannelData'
import { PermissionOverwriteResolvable } from '@src/api/entities/overwrite/interfaces/PermissionOverwriteResolvable'

export interface AbstractGuildChannelData extends AbstractChannelData {
  name: string
  position: number
  guildId: string
  parentId?: string
  permissionOverwrites?: PermissionOverwriteResolvable[]
}
