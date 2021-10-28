import { AnyChannel } from '@src/api/entities/channel/interfaces/AnyChannel'

export interface GuildChannelDeleteOptions {
  reason?: string
  patchEntity?: AnyChannel
}
