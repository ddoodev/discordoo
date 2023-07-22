import { GuildWelcomeScreenChannelData } from '../../../../../src/api/entities/guild/interfaces/GuildWelcomeScreenChannelData'

export interface GuildWelcomeScreenData {
  description?: string
  welcomeChannels: GuildWelcomeScreenChannelData[]
}