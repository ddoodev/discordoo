import { AbstractChannelData } from '@src/api/entities/channel/interfaces/AbstractChannelData'

export interface AbstractGuildChannelData extends AbstractChannelData {
  name: string
  position: number
  guildId: string
  parentId?: string
}
