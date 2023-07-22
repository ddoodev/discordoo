import { AbstractThreadChannel, AnyThreadChannel } from '../../../../../src/api'

export interface ThreadChannelEditOptions {
  reason?: string
  patchEntity?: AnyThreadChannel | AbstractThreadChannel
}
