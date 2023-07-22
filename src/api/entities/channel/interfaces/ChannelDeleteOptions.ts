import { AnyChannel } from '../../../../../src/api/entities/channel/interfaces/AnyChannel'

export interface ChannelDeleteOptions {
  reason?: string
  patchEntity?: AnyChannel
  isDm?: boolean
}
