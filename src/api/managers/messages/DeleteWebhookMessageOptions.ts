import { ThreadChannelResolvable } from '@src/api'

export interface DeleteWebhookMessageOptions {
  /** The reason for deleting the message */
  reason?: string
  /** Thread to delete the message from */
  thread?: ThreadChannelResolvable
}