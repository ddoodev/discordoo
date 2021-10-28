import { AnyThreadChannel } from '@src/api/entities/channel/interfaces/AnyThreadChannel'

export interface ThreadChannelEditOptions {
  reason?: string
  patchEntity?: AnyThreadChannel
}
