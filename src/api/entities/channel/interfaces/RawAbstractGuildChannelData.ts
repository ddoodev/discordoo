import { AbstractChannelData } from '@src/api/entities/channel/interfaces/AbstractChannelData'

export interface RawAbstractGuildChannelData extends AbstractChannelData {
  name: string
  position: number
  guild_id: string
  parent_id?: string
}
