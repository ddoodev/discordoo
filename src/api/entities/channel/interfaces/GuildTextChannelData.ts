import { AbstractGuildTextChannelData } from '@src/api/entities/channel/interfaces/AbstractGuildTextChannelData'

export interface GuildTextChannelData extends AbstractGuildTextChannelData {
  rateLimitPerUser?: number
}
