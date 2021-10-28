import { AnyGuildChannel } from '@src/api/entities/channel/interfaces/AnyGuildChannel'

export interface GuildChannelEditOptions {
  reason?: string
  patchEntity?: AnyGuildChannel
}
