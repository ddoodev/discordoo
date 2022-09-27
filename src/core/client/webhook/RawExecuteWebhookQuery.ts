export interface RawExecuteWebhookQuery {
  /** Send a message to the specified thread within a webhook's channel. The thread will automatically be unarchived. */
  thread_id?: string
  /** Wait for server confirmation of message send before response */
  wait?: boolean
}