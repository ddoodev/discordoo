import { AbstractGuildChannelData } from '@src/api/entities/channel/interfaces/AbstractGuildChannelData'

export interface GuildStoreChannelData extends AbstractGuildChannelData {
  nsfw: boolean
}
